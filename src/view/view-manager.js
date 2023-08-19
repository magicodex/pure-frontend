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
 * @returns {object}
 */
ViewManager.getViewScope = function (viewName) {
  if (!Utils.isString(viewName)) {
    throw new Error('argument#0 "viewName" required string');
  }

  var viewScope = ViewManager.viewScopes[viewName];

  if (Utils.isNullOrUndefined(viewScope)) {
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
  jqElement.attr(Global.config.viewStatusAttributeName, 'loading');

  var viewLoader = new ViewLoader(jqElement[0]);
  viewLoader.loadView(url);

  jqElement.attr(Global.config.viewStatusAttributeName, 'show');
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


/* SOURCE-CODE-END */

export { ViewManager };
