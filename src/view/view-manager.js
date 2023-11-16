"use strict";

import jQuery from 'jquery';
import { Utils } from '../utils';
import { View } from './view';
import { LoadedViewHolder } from './loaded-view-holder';
import { ViewScopeManager } from './view-scope-manager';
import { ViewLoader } from './view-loader';
import { Global } from '../global';
import { BrowserUrl } from '../helper/browser-url';
import { BrowserTitle } from '../helper/browser-title';

/* SOURCE-CODE-START */

/**
 * 视图管理器
 * @class
 */
function ViewManager() {
  //
}

ViewManager.currentTab = { tabIndex: 'default' };

var _VIEW_LOADED_TRUE = Global.constants.VIEW_LOADED_TRUE;
var _VIEW_LOADED_FALSE = Global.constants.VIEW_LOADED_FALSE;
var _VIEW_LOADED_ERROR = Global.constants.VIEW_LOADED_ERROR;
var _VIEW_STATUS_INIT = Global.constants.VIEW_STATUS_INIT;
var _VIEW_STATUS_READY = Global.constants.VIEW_STATUS_READY;
var _VIEW_STATUS_SHOW = Global.constants.VIEW_STATUS_SHOW;
var _VIEW_STATUS_HIDDEN = Global.constants.VIEW_STATUS_HIDDEN;
var _VIEW_STATUS_DESTROY = Global.constants.VIEW_STATUS_DESTROY;

/**
 * @description 加载视图
 * @param {string} url URL字符串
 */
ViewManager.loadView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqViewParent = jQuery(Global.config.singlePageViewParent);
  var viewSelector = Utils.formatString('main[{0}="{1}"]',
    [Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex]);
  var jqView = jqViewParent.children(viewSelector);

  var doLoadViewFn = function () {
    // 加载新的视图
    ViewManager.doRenderView(url, function () {
      // 结束新视图之前所有视图的生命周期
      jqView.each(function (index, viewElement) {
        ViewManager.stopViewLifecycle(viewElement);
      });
    });
  };

  if (jqView.length > 0) {
    var onViewClosingFn;
    var viewLoaded = jqView.attr(Global.config.viewLoadedAttributeName);

    if (Global.constants.VIEW_LOADED_TRUE === viewLoaded) {
      var viewHolder = new LoadedViewHolder(jqView);
      onViewClosingFn = viewHolder.getPropValueFromViewScope(View.ON_VIEW_CLOSING);

      if (!Utils.isNullOrUndefined(onViewClosingFn)) {
        var viewObject = viewHolder.getViewObject();
        onViewClosingFn(viewObject, doLoadViewFn);
      }
    }

    if (Utils.isNullOrUndefined(onViewClosingFn)) {
      doLoadViewFn();
    }
  } else {
    doLoadViewFn();
  }
};

/**
 * @description 替换视图
 * @param {string} url URL字符串
 */
ViewManager.replaceView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqViewParent = jQuery(Global.config.singlePageViewParent);
  var viewSelector = Utils.formatString('main[{0}="{1}"]',
    [Global.config.tabIndexAttributeName,
    ViewManager.currentTab.tabIndex]);
  var jqView = jqViewParent.children(viewSelector);

  // 加载新的视图
  ViewManager.doRenderView(url, function () {
    // 结束当前视图的生命周期
    ViewManager.stopViewLifecycle(jqView[0]);
  });
};

/**
 * @description 加载视图并添加到栈中
 * @param {string} url URL字符串
 */
ViewManager.pushView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqViewParent = jQuery(Global.config.singlePageViewParent);
  var viewSelector = Utils.formatString('main[{0}="{1}"]:first',
    [Global.config.viewStatusAttributeName, _VIEW_STATUS_SHOW]);
  var jqCurrentView = jqViewParent.children(viewSelector);

  // 加载新的视图
  ViewManager.doRenderView(url, function () {
    if (jqCurrentView.length > 0) {
      // 隐藏新视图之前的视图
      ViewManager.hiddenView(jqCurrentView[0], true);
    }
  });
};

/**
 * @description 从栈顶移除视图并显示该视图
 * @param {string} url URL字符串
 */
ViewManager.popView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqViewParent = jQuery(Global.config.singlePageViewParent);
  var viewSelector = Utils.formatString('main[{0}="{1}"]',
    [Global.config.tabIndexAttributeName,
    ViewManager.currentTab.tabIndex]);
  var jqView = jqViewParent.children(viewSelector);

  var doPopViewFn = function () {
    if (jqView.length >= 2) {
      // 结束当前视图的生命周期
      ViewManager.stopViewLifecycle(jqView[0]);
      // 恢复上个视图
      ViewManager.showView(jqView[1], true);
    } else {
      // 加载新的视图
      ViewManager.doRenderView(url, function () {
        if (jqView.length >= 1) {
          // 结束当前视图的生命周期
          ViewManager.stopViewLifecycle(jqView[0]);
        }
      });
    }
  };

  if (jqView.length > 0) {
    var onViewClosingFn;
    var viewLoaded = jqView.attr(Global.config.viewLoadedAttributeName);

    if (Global.constants.VIEW_LOADED_TRUE === viewLoaded) {
      var viewHolder = new LoadedViewHolder(jqView);
      onViewClosingFn = viewHolder.getPropValueFromViewScope(View.ON_VIEW_CLOSING);

      if (!Utils.isNullOrUndefined(onViewClosingFn)) {
        var viewObject = viewHolder.getViewObject;
        onViewClosingFn(viewObject, doPopViewFn);
      }
    }

    if (Utils.isNullOrUndefined(onViewClosingFn)) {
      doPopViewFn();
    }
  } else {
    doPopViewFn();
  }
};

/**
 * @description 加载视图
 * @param {string} url URL字符串
 * @param {function} [afterRenderFn]
 */
ViewManager.doRenderView = function (url, afterRenderFn) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqViewParent = jQuery(Global.config.singlePageViewParent);
  var viewSelector = Utils.formatString('main[{0}="{1}"][{2}="{3}"]',
    [Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex,
    Global.config.viewStatusAttributeName, _VIEW_STATUS_INIT]);
  var jqView = jqViewParent.find(viewSelector);

  if (jqView.length > 0) {
    return;
  }

  var jqNewView = jQuery('<main class="pure-view"></main>');
  jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
  jqNewView.attr(Global.config.viewStatusAttributeName, _VIEW_STATUS_INIT);
  jqNewView.css('display', 'none');
  jqNewView.prependTo(jqViewParent);

  var afterLoadFn = function (success, view, viewScope) {
    if (!(success === true)) {
      ViewManager.stopViewLifecycle(jqNewView);
      return;
    }

    if (!Utils.isNullOrUndefined(afterRenderFn)) {
      afterRenderFn(view.getViewElement());
    }

    // 开启视图生命周期
    ViewManager.startViewLifecycle(jqNewView[0]);
  };

  // 创建视图加载器
  var viewLoader = new ViewLoader(jqNewView[0], afterLoadFn);
  // 加载视图
  viewLoader.loadView(url);
};

/**
 * @description 开启视图生命周期
 * @param {(Document|Element)} viewElement 
 */
ViewManager.startViewLifecycle = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  var jqView = jQuery(viewElement);
  var viewHolder = new LoadedViewHolder(jqView);
  var viewObject = viewHolder.getViewObject();
  var tabIndex = viewHolder.getAttrValueFromTagElement(Global.config.tabIndexAttributeName);
  var viewStatus = viewHolder.getAttrValueFromTagElement(Global.config.viewStatusAttributeName);

  if (_VIEW_STATUS_DESTROY === viewStatus) {
    var viewIndex = viewHolder.getAttrValueFromTagElement(Global.config.viewIndexAttributeName);
    // 移除该视图对应的作用域
    ViewScopeManager.removeViewScope(viewIndex);

    return;
  }

  jqView.attr(Global.config.viewStatusAttributeName, _VIEW_STATUS_READY);

  var onViewLifecycleStart = viewHolder.getPropValueFromViewScope(View.ON_VIEW_LIFECYCLE_START);
  if (!Utils.isNullOrUndefined(onViewLifecycleStart)) {
    // 视图生命周期开启时调用
    onViewLifecycleStart(viewObject);
  }

  if (tabIndex === ViewManager.currentTab.tabIndex) {
    // 显示视图
    ViewManager.showView(viewElement);
  } else {
    // 隐藏视图
    ViewManager.hiddenView(viewElement);
  }
};

/**
 * @description 结束视图生命周期
 * @param {(Document|Element)} viewElement 
 */
ViewManager.stopViewLifecycle = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  // 隐藏视图
  ViewManager.hiddenView(viewElement);

  var jqView = jQuery(viewElement);
  var viewStatus = jqView.attr(Global.config.viewStatusAttributeName);

  if (!(_VIEW_STATUS_HIDDEN === viewStatus || _VIEW_STATUS_INIT === viewStatus
    || _VIEW_STATUS_READY === viewStatus)) {
    return;
  }

  if (!(_VIEW_STATUS_INIT === viewStatus)) {
    var viewHolder = new LoadedViewHolder(jqView);
    var viewObject = viewHolder.getViewObject();
    var onViewLifecycleStop = viewHolder.getPropValueFromViewScope(View.ON_VIEW_LIFECYCLE_STOP);

    if (!Utils.isNullOrUndefined(onViewLifecycleStop)) {
      // 视图生命周期结束时调用
      onViewLifecycleStop(viewObject);
    }

    var viewIndex = viewHolder.getAttrValueFromTagElement(Global.config.viewIndexAttributeName);
    // 移除该视图对应的作用域
    ViewScopeManager.removeViewScope(viewIndex);
  }

  jqView.attr(Global.config.viewStatusAttributeName, _VIEW_STATUS_DESTROY);
  // 移除该视图对应的 DOM 元素
  jqView.remove();
};

/**
 * @description 显示视图
 * @param {(Document|Element)} targetElement 
 * @param {boolean} [popMode=false]
 */
ViewManager.showView = function (viewElement, popMode) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  popMode = (popMode === true);
  var jqView = jQuery(viewElement);
  var viewHolder = new LoadedViewHolder(jqView);
  var viewObject = viewHolder.getViewObject();
  var viewStatus = viewHolder.getAttrValueFromTagElement(Global.config.viewStatusAttributeName);

  if (!(_VIEW_STATUS_READY === viewStatus || _VIEW_STATUS_HIDDEN === viewStatus)) {
    return;
  }

  // 设置该视图成可见
  viewHolder.setAttrValueToTagElement(Global.config.viewStatusAttributeName, _VIEW_STATUS_SHOW);
  viewHolder.setViewToShow();
  // 修改浏览器URL
  var viewUrl = viewHolder.getAttrValueFromTagElement(Global.config.viewUrlAttributeName);
  BrowserUrl.setBrowserUrl(viewUrl);
  var viewTitle = viewHolder.getAttrValueFromTagElement(Global.config.viewTitleAttributeName);
  BrowserTitle.setBrowserTitle(viewTitle);

  var onViewShow = viewHolder.getPropValueFromViewScope(View.ON_VIEW_SHOW);
  if (!Utils.isNullOrUndefined(onViewShow)) {
    // 视图显示时调用
    onViewShow(viewObject);
  }

  if (popMode) {
    var onViewPop = viewHolder.getPropValueFromViewScope(View.ON_VIEW_POP);

    if (!Utils.isNullOrUndefined(onViewPop)) {
      onViewPop(viewObject);
    }
  }
};

/**
 * @description 隐藏视图
 * @param {(Document|Element)} viewElement 
 * @param {boolean} [pushMode=false]
 */
ViewManager.hiddenView = function (viewElement, pushMode) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  pushMode = (pushMode === true);
  var jqView = jQuery(viewElement);
  var viewStatus = jqView.attr(Global.config.viewStatusAttributeName);

  if (!(_VIEW_STATUS_SHOW === viewStatus || _VIEW_STATUS_READY === viewStatus)) {
    return;
  }

  if (!(_VIEW_STATUS_READY === viewStatus)) {
    var viewHolder = new LoadedViewHolder(jqView);
    var viewObject = viewHolder.getViewObject();
    var onViewHidden = viewHolder.getPropValueFromViewScope(View.ON_VIEW_HIDDEN);

    if (!Utils.isNullOrUndefined(onViewHidden)) {
      // 视图隐藏时调用
      onViewHidden(viewObject);
    }

    if (pushMode) {
      var onViewPush = viewHolder.getPropValueFromViewScope(View.ON_VIEW_PUSH);

      if (!Utils.isNullOrUndefined(onViewPush)) {
        onViewPush(viewObject);
      }
    }

    // 设置该视图成不可见
    viewHolder.setAttrValueToTagElement(Global.config.viewStatusAttributeName, _VIEW_STATUS_HIDDEN);
    viewHolder.setViewToHide();
  }
};


/* SOURCE-CODE-END */

export { ViewManager };
