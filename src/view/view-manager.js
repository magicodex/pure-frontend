"use strict";

import jQuery from 'jquery';
import { Utils } from '../utils';
import { ViewLoader } from './view-loader';
import { Global } from '../global';

/* SOURCE-CODE-START */

/**
 * 视图管理器
 * @class
 */
function ViewManager() {
  //
}

ViewManager.viewScopes = {};
ViewManager.currentTab = { tabIndex: 'default' };
ViewManager.sequenceGenerator = new SequenceGenerator(100001);
ViewManager.appSelector = '.pure-app';

ViewManager.VIEW_STATUS_LOADING = 'loading';
ViewManager.VIEW_STATUS_SHOW = 'show';
ViewManager.VIEW_STATUS_HIDDEN = 'hidden';
ViewManager.VIEW_STATUS_DESTROY = 'destroy';

/**
 * @description 返回指定的视图作用域
 * @param {string} viewName 视图名
 * @param {boolean} [allowCreate=true]
 * @returns {object}
 */
ViewManager.getViewScope = function (viewName, allowCreate) {
  if (!Utils.isString(viewName)) {
    throw new Error('argument#0 "viewName" required string');
  }

  allowCreate = !(allowCreate === false);
  var viewScope = ViewManager.viewScopes[viewName];

  if (Utils.isNullOrUndefined(viewScope) && allowCreate) {
    viewScope = {};
    ViewManager.viewScopes[viewName] = viewScope;
  }

  return viewScope;
};

/**
 * @description 设置指定的视图作用域
 * @param {string} viewName 视图名
 * @param {object} viewScope
 */
ViewManager.setViewScope = function (viewName, viewScope) {
  if (!Utils.isString(viewName)) {
    throw new Error('argument#0 "viewName" required string');
  }

  ViewManager.viewScopes[viewName] = viewScope;
};


/**
 * @description 移除指定的视图作用域
 * @param {string} viewName 视图名
 */
ViewManager.removeViewScope = function (viewName) {
  if (!Utils.isString(viewName)) {
    throw new Error('argument#0 "viewName" required string');
  }

  delete ViewManager.viewScopes[viewName];
};

/**
 * @description 加载视图
 * @param {string} url URL字符串
 */
ViewManager.loadView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqViewParent = jQuery(ViewManager.appSelector);
  var viewSelector = Utils.formatString('main[{0}="{1}"]',
    [Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex]);
  var jqView = jqViewParent.children(viewSelector);

  // 加载新的视图
  ViewManager.doRenderView(url, function () {
    // 结束新视图之前所有视图的生命周期
    jqView.each(function (index, viewElement) {
      ViewManager.stopViewLifecycle(viewElement);
    });
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

  var jqViewParent = jQuery(ViewManager.appSelector);
  var viewSelector = Utils.formatString('main[{0}="{1}"]:first',
    [Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_SHOW]);
  var jqCurrentView = jqViewParent.children(viewSelector);

  // 加载新的视图
  ViewManager.doRenderView(url, function () {
    if (jqCurrentView.length > 0) {
      // 隐藏新视图之前的视图
      ViewManager.hiddenView(jqCurrentView[0]);
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

  var jqViewParent = jQuery(ViewManager.appSelector);
  var viewSelector = Utils.formatString('main[{0}="{1}"]',
    [Global.config.tabIndexAttributeName,
    ViewManager.currentTab.tabIndex]);
  var jqView = jqViewParent.children(viewSelector);

  if (jqView.length >= 2) {
    // 结束当前视图的生命周期
    ViewManager.stopViewLifecycle(jqView[0]);
    // 恢复上个视图
    ViewManager.showView(jqView[1]);
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

/**
 * @description 加载视图
 * @param {string} url URL字符串
 * @param {function} [callbackFn]
 */
ViewManager.doRenderView = function (url, callbackFn) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqViewParent = jQuery(ViewManager.appSelector);
  var viewSelector = Utils.formatString('main[{0}="{1}"][{2}="{3}"]',
    [Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex,
    Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_LOADING]);
  var jqView = jqViewParent.find(viewSelector);

  if (jqView.length > 0) {
    return;
  }

  var jqNewView = jQuery('<main class="pure-view"></main>');
  jqNewView.attr(Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_LOADING);
  jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
  jqNewView.css('visibility', 'hidden');
  jqNewView.prependTo(jqViewParent);

  // 创建视图加载器
  var viewLoader = new ViewLoader(jqNewView[0], function (viewScope, view) {
    var sequenceNumber = ViewManager.sequenceGenerator.nextValue();
    var viewInfo = view.getViewInfo();
    var viewName = viewInfo.getViewName();
    var viewIndex = viewName + '_' + sequenceNumber;
    // 记录视图索引
    jqNewView.attr(Global.config.viewIndexAttributeName, viewIndex);

    // 修改视图作用域的名称以支持同时加载多个相同的视图
    if (!Utils.isNullOrUndefined(viewScope)) {
      ViewManager.setViewScope(viewIndex, viewScope);
      ViewManager.removeViewScope(viewName);
    }

    if (!Utils.isNullOrUndefined(callbackFn)) {
      callbackFn();
    }

    // 开启视图生命周期
    ViewManager.startViewLifecycle(jqNewView[0]);
  });

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
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);
  var tabIndex = jqView.attr(Global.config.tabIndexAttributeName);
  var viewStatus = jqView.attr(Global.config.viewStatusAttributeName);

  if (viewStatus === ViewManager.VIEW_STATUS_DESTROY) {
    // 移除该视图对应的作用域
    ViewManager.removeViewScope(viewIndex);

    return;
  }

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewLifecycleStart = viewScope.onViewLifecycleStart;

      if (!Utils.isNullOrUndefined(onViewLifecycleStart)) {
        // 视图生命周期开启时调用
        onViewLifecycleStart();
      }
    }
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
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);
  var viewStatus = jqView.attr(Global.config.viewStatusAttributeName);

  if (!(viewStatus === ViewManager.VIEW_STATUS_HIDDEN || viewStatus === ViewManager.VIEW_STATUS_LOADING)) {
    return;
  }

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!(viewStatus === ViewManager.VIEW_STATUS_LOADING) && !Utils.isNullOrUndefined(viewScope)) {
      var onViewLifecycleStop = viewScope.onViewLifecycleStop;

      if (!Utils.isNullOrUndefined(onViewLifecycleStop)) {
        // 视图生命周期结束时调用
        onViewLifecycleStop();
      }

      // 移除该视图对应的作用域
      ViewManager.removeViewScope(viewIndex);
    }
  }

  jqView.attr(Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_DESTROY);
  // 移除该视图对应的 DOM 元素
  jqView.remove();
};

/**
 * @description 显示视图
 * @param {(Document|Element)} targetElement 
 */
ViewManager.showView = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  var jqView = jQuery(viewElement);
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);
  var viewStatus = jqView.attr(Global.config.viewStatusAttributeName);

  if (!(viewStatus === ViewManager.VIEW_STATUS_LOADING || viewStatus === ViewManager.VIEW_STATUS_HIDDEN)) {
    return;
  }

  // 设置该视图成可见
  jqView.attr(Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_SHOW);
  jqView.css('visibility', 'visible');

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewShow = viewScope.onViewShow;

      if (!Utils.isNullOrUndefined(onViewShow)) {
        // 视图显示时调用
        onViewShow();
      }
    }
  }
};

/**
 * @description 隐藏视图
 * @param {(Document|Element)} viewElement 
 */
ViewManager.hiddenView = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  var jqView = jQuery(viewElement);
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);
  var viewStatus = jqView.attr(Global.config.viewStatusAttributeName);

  if (!(viewStatus === ViewManager.VIEW_STATUS_SHOW || viewStatus === ViewManager.VIEW_STATUS_LOADING)) {
    return;
  }

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!(viewStatus === ViewManager.VIEW_STATUS_LOADING) && !Utils.isNullOrUndefined(viewScope)) {
      var onViewHidden = viewScope.onViewHidden;

      if (!Utils.isNullOrUndefined(onViewHidden)) {
        // 视图隐藏时调用
        onViewHidden();
      }
    }
  }

  // 设置该视图成不可见
  jqView.attr(Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_HIDDEN);
  jqView.css('visibility', 'hidden');
};

/* SOURCE-CODE-END */

export { ViewManager };
