"use strict";

import jQuery from 'jquery';
import { Utils } from '../utils';
import { ViewScopeManager } from './view-scope-manager';
import { SequenceGenerator } from '../helper/sequence-generator';
import { View } from './view';
import { ViewResponse } from './view-response';
import { AjaxResult } from '../ajax/ajax-result';
import { Global } from '../global';

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
  this._jQueryObject = jQuery(targetElement);
}

ViewLoader.sequenceGenerator = new SequenceGenerator(100001);
ViewLoader.lastViewInfo = {};

/**
 * @description 加载视图
 * @param {string} url 
 */
ViewLoader.prototype.loadView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var deferred = jQuery.ajax({
    url: url,
    type: 'POST',
    error: function (jqXHR, textStatus, errorThrown) {
      // 覆盖全局的错误处理
    }
  });

  var jqElement = _jQueryObject;
  var viewLoader = this;
  // 标记视图未完成加载
  jqElement.attr(Global.config.viewLoadedAttributeName, Global.constants.VIEW_LOADED_FALSE);

  deferred.done(function (data, textStatus, jqXHR) {
    try {
      // 判断是否需要渲染视图
      if (!viewLoader.preRenderView(url, data, textStatus, jqXHR)) {
        if (!Utils.isNullOrUndefined(viewLoader._callbackFn)) {
          // 调用回调函数
          viewLoader._callbackFn(false);
        }

        return;
      }

      // 渲染视图
      viewLoader.renderView(url, data, textStatus, jqXHR);
    } catch (error) {
      console.error(error);
      // 标记视图加载出错
      jqElement.attr(Global.config.viewLoadedAttributeName, Global.constants.VIEW_LOADED_ERROR);

      if (!Utils.isNullOrUndefined(viewLoader._callbackFn)) {
        // 调用回调函数
        viewLoader._callbackFn(false);
      }
    }
  }).fail(function (jqXHR, textStatus, errorThrown) {
    AjaxResult.handleAjaxError(null, jqXHR, textStatus, errorThrown);
    // 标记视图加载出错
    jqElement.attr(Global.config.viewLoadedAttributeName, Global.constants.VIEW_LOADED_ERROR);

    if (!Utils.isNullOrUndefined(viewLoader._callbackFn)) {
      // 调用回调函数
      viewLoader._callbackFn(false);
    }
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
  var viewTitle = viewInfo.getViewTitle();
  var jqElement = this._jQueryObject;

  jqElement.attr('id', viewName);
  // 渲染视图
  jqElement.html(data);
  // 添加自定义属性
  jqElement.attr(Global.config.viewTitleAttributeName, viewTitle);
  jqElement.attr(Global.config.viewNameAttributeName, viewName);
  jqElement.attr(Global.config.viewUrlAttributeName, url);
  // 执行初始逻辑
  this.initViewAfterRender();

  var viewScope = ViewScopeManager.getViewScope(viewName);
  viewScope = Utils.emptyObjectIfNullOrUndefined(viewScope);
  var view = new View(this._targetElement, viewInfo, viewScope);
  viewScope.VIEW = view;
  ViewLoader.lastViewInfo.viewScope = viewScope;
  ViewLoader.lastViewInfo.view = view;

  if (!Utils.isNullOrUndefined(viewScope)) {
    var mainFn = viewScope.main;

    if (!Utils.isNullOrUndefined(mainFn)) {
      // 调用主函数
      mainFn(viewScope, view);
    }
  }

  // 标记视图加载完成
  jqElement.attr(Global.config.viewLoadedAttributeName, Global.constants.VIEW_LOADED_TRUE);

  if (!Utils.isNullOrUndefined(this._callbackFn)) {
    // 调用回调函数
    this._callbackFn(true, viewScope, view);
  }
};

/**
 * @description 在渲染视图后初始
 */
ViewLoader.prototype.initViewAfterRender = function () {
  var jqView = this._jQueryObject;
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
