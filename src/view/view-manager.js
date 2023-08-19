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

  var selector = Utils.formatString('[{0}="{1}"]',
    [Global.config.viewStatusAttributeName, 'show']);
  var jqElement = jQuery(selector);

  if (jqElement.length <= 0) {
    return;
  }

  ViewManager.onViewCreate(jqElement);
  jqElement.attr(Global.config.viewStatusAttributeName, 'loading');
  jqElement.removeAttr(Global.config.viewIndexAttributeName);

  var viewLoader = new ViewLoader(jqElement[0]);
  viewLoader.loadView(url);

  jqElement.attr(Global.config.viewStatusAttributeName, 'show');
  ViewManager.onViewCreate(jqElement);
};

/**
 * @description 加载视图并添加到栈中
 * @param {string} url URL字符串
 */
ViewManager.pushView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  ViewManager.loadView(url);
};

/**
 * @description 从栈顶移除视图并显示该视图
 * @param {string} url URL字符串
 */
ViewManager.popView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  ViewManager.loadView(url);
};

ViewManager.onViewCreate = function (jqView) {
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

ViewManager.onViewPause = function (jqView) {

};

ViewManager.onViewResume = function (jqView) {

};

ViewManager.onViewDestroy = function (jqView) {
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
};

/* SOURCE-CODE-END */

export { ViewManager };
