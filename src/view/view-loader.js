"use strict";

import jQuery from 'jquery';
import { Utils } from '../utils';
import { ViewManager } from './view-manager';
import { SequenceGenerator } from '../helper/sequence-generator';
import { BrowserUrl } from '../helper/browser-url';
import { View } from './view';
import { ViewResponse } from './view-response';

/* SOURCE-CODE-START */

/**
 * 视图加载器
 * @class
 * @param {(Document|Element)} targetElement 
 * @param {function} [callbackFn]
 */
function ViewLoader(targetElement, callbackFn) {
  if (Utils.isNullOrUndefined(targetElement)) {
    throw new Error('argument#0 "targetElement is null/undefined');
  }

  this._targetElement = targetElement;
  this._callbackFn = callbackFn;
}

ViewLoader.sequenceGenerator = new SequenceGenerator(100001);
ViewLoader.lastViewInfo = {};

/**
 * @function 加载视图
 * @param {string} url 
 */
ViewLoader.prototype.loadView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var deferred = jQuery.ajax({
    url: url,
    type: 'POST'
  });
  var viewLoader = this;

  deferred.done(function (data, textStatus, jqXHR) {
    // 判断是否需要渲染视图
    if (!viewLoader.preRenderView(url, data, textStatus, jqXHR)) {
      return;
    }

    // 渲染视图
    viewLoader.renderView(url, data, textStatus, jqXHR);
  });
};

/**
 * @description 判断是否需要渲染视图
 * @param {string} url 
 * @param {*} data 
 * @param {string} textStatus 
 * @param {jQuery.jqXHR} jqXHR 
 */
ViewLoader.prototype.preRenderView = function (url, data, textStatus, jqXHR) {
  return true;
};

/**
 * @description 渲染视图
 * @param {string} url 
 * @param {*} data 
 * @param {string} textStatus 
 * @param {jQuery.jqXHR} jqXHR 
 */
ViewLoader.prototype.renderView = function (url, data, textStatus, jqXHR) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var viewResponse = new ViewResponse(url, jqXHR);
  var viewInfo = viewResponse.getViewInfo();
  var viewName = viewInfo.getViewName();
  var jqElement = jQuery(this._targetElement);

  jqElement.attr('id', viewName);
  // 渲染视图
  jqElement.html(data);
  // 执行初始逻辑
  this.initViewAfterRender();
  // 修改浏览器URL
  BrowserUrl.setBrowserUrl(url);

  var view = new View(this._targetElement, viewInfo);
  var viewScope = ViewManager.getViewScope(viewName);
  ViewLoader.lastViewInfo.viewScope = Utils.emptyObjectIfNullOrUndefined(viewScope);
  ViewLoader.lastViewInfo.view = view;

  if (!Utils.isNullOrUndefined(viewScope)) {
    var mainFn = viewScope.main;

    if (!Utils.isNullOrUndefined(mainFn)) {
      // 调用主函数
      mainFn(viewScope, view);
    }
  }

  if (!Utils.isNullOrUndefined(this._callbackFn)) {
    this._callbackFn(viewScope, view);
  }
};

/**
 * @description 在渲染视图后初始
 */
ViewLoader.prototype.initViewAfterRender = function () {
  var jqView = jQuery(this._targetElement);
  var jqLabel = jqView.find('label[for]');

  // 每个 label 标签对应的 id 加上后缀，
  // 防止 id 重复导致的问题
  jqLabel.each(function (index, labelElement) {
    var id = labelElement.getAttribute('for');

    if (Utils.isNotEmptyString(id)) {
      var sequenceNumber = ViewLoader.sequenceGenerator.nextValue();
      var newId = id + '_' + sequenceNumber;

      var inputSelector = '#' + id;
      var jqInputElement = jqView.find(inputSelector);

      jqInputElement.attr('id', newId);
      labelElement.setAttribute('for', newId);
    }
  });
};

/* SOURCE-CODE-END */

export { ViewLoader };
