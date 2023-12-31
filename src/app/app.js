"use strict";

import { Utils } from '../utils';
import { ViewManager } from '../view/view-manager';
import { ViewScopeManager } from '../view/view-scope-manager';
import { AppAlertMessages } from './app-alert-messages';

/* SOURCE-CODE-START */

/**
 * @class
 */
function App() {
  //
}

/**
 * @description 初始视图作用域
 * @param {string} viewName 
 * @param {function} registerFn 
 */
App.viewScope = function (viewName, registerFn) {
  if (!Utils.isString(viewName)) {
    throw new Error('argument#0 "viewName" required string');
  }

  if (!Utils.isFunction(registerFn)) {
    throw new Error('argument#1 "registerFn" required function');
  }

  var viewScope = ViewScopeManager.getViewScope(viewName);
  // 调用回调函数初始作用域
  registerFn(viewScope);
};

/**
 * @description 注册视图主函数
 * @param {string} viewName 
 * @param {function} mainFn 
 */
App.viewMain = function (viewName, mainFn) {
  if (!Utils.isString(viewName)) {
    throw new Error('argument#0 "viewName" required string');
  }

  if (!Utils.isFunction(mainFn)) {
    throw new Error('argument#1 "mainFn" required function');
  }

  var viewScope = ViewScopeManager.getViewScope(viewName);
  // 设置主函数
  viewScope.main = mainFn;
};

/**
 * @description 显示信息
 * @param {string} message 
 */
App.showMessage = function (message) {
  AppAlertMessages.showMessage(message);
};

/**
 * @description 显示错误信息
 * @param {string} message 
 */
App.showError = function (message) {
  AppAlertMessages.showError(message);
};

/**
 * @description 加载视图
 * @param {string} url URL字符串
 */
App.loadView = function (url) {
  ViewManager.loadView(url);
};

/**
 * @description 替换视图
 * @param {string} url URL字符串
 */
App.replaceView = function (url) {
  ViewManager.replaceView(url);
};

/**
 * @description 加载视图并添加到堆栈顶部
 * @param {string} url URL字符串
 */
App.pushView = function (url) {
  ViewManager.pushView(url);
};

/**
 * @description 返回到之前的视图
 * @param {string} url URL字符串
 */
App.popView = function (url) {
  ViewManager.popView(url);
};


/* SOURCE-CODE-END */

export { App };
