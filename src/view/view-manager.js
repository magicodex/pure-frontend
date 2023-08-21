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
    // 销毁所有视图
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
    [Global.config.viewStatusAttributeName, 'show']);
  var jqCurrentView = jqViewParent.children(viewSelector);

  // 加载新的视图
  ViewManager.doRenderView(url, function () {
    if (jqCurrentView.length > 0) {
      // 暂停当前视图
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
    // 恢复上个视图
    ViewManager.showView(jqView[1]);
    // 销毁当前视图
    ViewManager.stopViewLifecycle(jqView[0]);
  } else {
    // 加载新的视图
    ViewManager.doRenderView(url, function () {
      if (jqView.length >= 1) {
        // 销毁当前视图
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
  var jqNewView = jQuery('<main class="pure-view"></main>');
  jqNewView.attr(Global.config.viewStatusAttributeName, 'loading');
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

    // 初始视图
    ViewManager.startViewLifecycle(jqNewView[0]);
  });

  // 加载视图
  viewLoader.loadView(url);
};

/**
 * @description 初始视图
 * @param {(Document|Element)} viewElement 
 */
ViewManager.startViewLifecycle = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  var jqView = jQuery(viewElement);
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);
  // 设置该视图成可见
  jqView.attr(Global.config.viewStatusAttributeName, 'show');
  jqView.css('visibility', 'visible');

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewLifecycleStart = viewScope.onViewLifecycleStart;

      if (!Utils.isNullOrUndefined(onViewLifecycleStart)) {
        // 视图创建后调用
        onViewLifecycleStart();
      }
    }
  }
};

/**
 * @description 销毁视图
 * @param {(Document|Element)} viewElement 
 */
ViewManager.stopViewLifecycle = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  var jqView = jQuery(viewElement);
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewLifecycleEnd = viewScope.onViewLifecycleEnd;

      if (!Utils.isNullOrUndefined(onViewLifecycleEnd)) {
        // 视图销毁前调用
        onViewLifecycleEnd();
      }

      // 移除该视图对应的作用域
      ViewManager.removeViewScope(viewIndex);
    }
  }

  // 移除该视图对应的 DOM 元素
  jqView.remove();
};

/**
 * @description 恢复视图
 * @param {(Document|Element)} targetElement 
 */
ViewManager.showView = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  var jqView = jQuery(viewElement);
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);
  // 设置该视图成可见
  jqView.attr(Global.config.viewStatusAttributeName, 'show');
  jqView.css('visibility', 'visible');

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewShow = viewScope.onViewShow;

      if (!Utils.isNullOrUndefined(onViewShow)) {
        // 视图恢复时调用
        onViewShow();
      }
    }
  }
};

/**
 * @description 暂停视图
 * @param {(Document|Element)} viewElement 
 */
ViewManager.hiddenView = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  var jqView = jQuery(viewElement);
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewHidden = viewScope.onViewHidden;

      if (!Utils.isNullOrUndefined(onViewHidden)) {
        // 视图暂停时调用
        onViewHidden();
      }
    }
  }

  // 设置该视图成不可见
  jqView.attr(Global.config.viewStatusAttributeName, 'hidden');
  jqView.css('visibility', 'hidden');
};

/* SOURCE-CODE-END */

export { ViewManager };
