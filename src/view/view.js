"use strict";


import jQuery from 'jquery';
import uiData from 'ui-data';
import { Utils } from '../utils';
import { Global } from '../global';
import { UrlParser } from '../helper/url-parser';
import { ViewInfo } from './view-info';
import { AjaxCallService } from '../ajax/ajax-call-service';

/* SOURCE-CODE-START */

/**
 * 视图
 * @class
 * @param {(Document|Element)} viewElement 
 * @param {ViewInfo} viewInfo 
 * @param {*} viewScope
 */
function View(viewElement, viewInfo, viewScope) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  if (Utils.isNullOrUndefined(viewInfo)) {
    throw new Error('argument#1 "viewInfo is null/undefined');
  }

  this._viewElement = viewElement;
  this._viewInfo = viewInfo;
  this._viewScope = viewScope;
  this._uiNameAttributeName = Global.config.uiNameAttributeName;
  this._dataModel = new uiData.Model(viewElement);

  var fullUrl = viewInfo.getFullUrl();
  var urlPattern = viewInfo.getUrlPattern();
  this._urlParams = UrlParser.parseAllParams(fullUrl, urlPattern);
}

/**
 * @description 返回视图元素
 * @returns {(Document|Element)}
 */
View.prototype.getViewElement = function () {
  return this._viewElement;
};

/**
 * @description 返回视图信息
 * @returns {object}
 */
View.prototype.getViewInfo = function () {
  return this._viewInfo;
};

/**
 * @description 返回视图作用域
 * @returns {*}
 */
View.prototype.getViewScope = function () {
  return this._viewScope;
};


/**
 * @description 返回数据模型
 * @returns {uiData.Model}
 */
View.prototype.getDataModel = function () {
  return this._dataModel;
};

/**
 * @description 返回 URL 参数
 * @returns {object}
 */
View.prototype.getUrlParams = function () {
  return this._urlParams;
};

/**
 * @description 返回 URL 参数
 * @param {string} name 
 * @returns {string}
 */
View.prototype.getUrlParam = function (name) {
  return this._urlParams[name];
};

/**
 * @description 调用远程接口
 * @param {string} url 
 * @param {*} [data] 
 * @param {*} [opts] 
 * @returns {AjaxResult}
 */
View.prototype.callService = function (url, data, opts) {
  var ajaxCallService = new AjaxCallService(this._viewElement);
  return ajaxCallService.callService(url, data, opts);
};

/**
 * @description 查找标签元素，参数格式与 jQuery.find() 相同
 * @param {...any} args
 * @returns {jQuery}
 */
View.prototype.$find = function () {
  var jqElement = jQuery(this._viewElement);

  return jqElement.find.apply(jqElement, arguments);
};

/**
 * @description 查找标签元素，通过 Global.config.uiNameAttributeName 指定的属性
 * @param {string} name
 * @returns {jQuery}
 */
View.prototype.$ui = function (name) {
  if (Utils.isNullOrUndefined(name)) {
    throw new Error('argument#0 "name" is null/undefined');
  }

  var jqElement = jQuery(this._viewElement);
  var selector = Utils.formatString('[{0}="{1}"]',
    [this._uiNameAttributeName, name]);

  return jqElement.find(selector);
};

/* SOURCE-CODE-END */

export { View };
