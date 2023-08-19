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
ViewManager.currentTabIndex = 'default';

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

  var jqTargetElement = jQuery('.pure-app');
  var selector = Utils.formatString('main[{0}="{1}"]',
    [Global.config.tabIndexAttributeName, ViewManager.currentTabIndex]);
  var jqAllViews = jqTargetElement.children(selector);

  // 销毁所有视图
  jqAllViews.each(function (index, viewElement) {
    ViewManager.destroyView(jQuery(viewElement));
  });

  // 加载视图
  ViewManager.doRenderView(url);
};

/**
 * @description 加载视图并添加到栈中
 * @param {string} url URL字符串
 */
ViewManager.pushView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqTargetElement = jQuery('.pure-app');
  var jqCurrentView = jqTargetElement.children('main').first();
  // 暂停当前视图
  ViewManager.pauseView(jqCurrentView);

  // 加载视图
  ViewManager.doRenderView(url);
};

/**
 * @description 从栈顶移除视图并显示该视图
 * @param {string} url URL字符串
 */
ViewManager.popView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqTargetElement = jQuery('.pure-app');
  var selector = Utils.formatString('main[{0}="{1}"]',
    [Global.config.tabIndexAttributeName, ViewManager.currentTabIndex]);
  var jqCurrentView = jqTargetElement.children(selector).first();
  // 销毁当前视图
  ViewManager.destroyView(jqCurrentView);

  var jqNextView = jqTargetElement.children(selector).first();
  if (jqNextView.length > 0) {
    // 恢复视图
    ViewManager.resumeView(jqNextView);
  } else {
    // 加载视图
    ViewManager.doRenderView(url);
  }
};

/**
 * @description 加载视图
 * @param {string} url URL字符串
 */
ViewManager.doRenderView = function (url) {
  var jqTargetElement = jQuery('.pure-app');

  var jqNewView = jQuery('<main class="pure-view-main"></main>');
  jqNewView.attr(Global.config.viewStatusAttributeName, 'loading');
  jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTabIndex);
  jqNewView.prependTo(jqTargetElement);

  var viewLoader = new ViewLoader(jqNewView[0]);
  viewLoader.loadView(url);
  // 初始视图
  ViewManager.initView(jqNewView);
};

/**
 * @description 初始视图
 * @param {jQuery} jqView 
 */
ViewManager.initView = function (jqView) {
  jqView.attr(Global.config.viewStatusAttributeName, 'show');
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewCreate = viewScope.onViewCreate;

      if (!Utils.isNullOrUndefined(onViewCreate)) {
        onViewCreate();
      }
    }
  }
};

/**
 * @description 销毁视图
 * @param {jQuery} jqView 
 */
ViewManager.destroyView = function (jqView) {
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewDestroy = viewScope.onViewDestroy;

      if (!Utils.isNullOrUndefined(onViewDestroy)) {
        onViewDestroy();
      }

      ViewManager.removeViewScope(viewIndex);
    }
  }

  jqView.remove();
};

/**
 * @description 暂停视图
 * @param {jQuery} jqView 
 */
ViewManager.pauseView = function (jqView) {
  jqView.attr(Global.config.viewStatusAttributeName, 'hidden');
  jqView.css('visibility', 'hidden');
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewPause = viewScope.onViewPause;

      if (!Utils.isNullOrUndefined(onViewPause)) {
        onViewPause();
      }
    }
  }
};

/**
 * @description 恢复视图
 * @param {jQuery} jqView 
 */
ViewManager.resumeView = function (jqView) {
  jqView.attr(Global.config.viewStatusAttributeName, 'show');
  jqView.css('visibility', 'visible');
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewResume = viewScope.onViewResume;

      if (!Utils.isNullOrUndefined(onViewResume)) {
        onViewResume();
      }
    }
  }
};

/* SOURCE-CODE-END */

export { ViewManager };
