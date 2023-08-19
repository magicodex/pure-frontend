"use strict";

import jQuery from 'jquery';
import { Utils } from '../utils';
import { Global } from '../global';

/* SOURCE-CODE-START */

/**
 * 浏览器URL
 * @class
 */
function BrowserUrl() {
  //
}

/**
 * @description 返回对应的浏览器URL
 * @param {string} viewUrl 
 * @returns {string}
 */
BrowserUrl.getBrowserUrl = function (viewUrl) {
  if (!Utils.isString(viewUrl)) {
    throw new Error('argument#0 "viewUrl" required string');
  }

  // 生成浏览器栏该显示的URL
  var newUrl = viewUrl.startsWith('/')
    ? ('#' + viewUrl)
    : ('#/' + viewUrl);
  newUrl = BrowserUrl.getFullUrl(Global.config.singlePageBaseUrl) + newUrl;

  return newUrl;
};

/**
 * @description 修改浏览器URL
 * @param {string} viewUrl 
 */
BrowserUrl.setBrowserUrl = function (viewUrl) {
  if (!Utils.isString(viewUrl)) {
    throw new Error('argument#0 "viewUrl" required string');
  }

  // 生成浏览器栏该显示的URL
  var newUrl = BrowserUrl.getBrowserUrl(viewUrl);

  // 修改浏览器URL
  BrowserUrl.setLocationUrl(newUrl);
};

/**
 * @description 返回完整的 URL 路径
 * @param {string} relativeUrl 
 * @returns {string}
 */
BrowserUrl.getFullUrl = function (relativeUrl) {
  if (!Utils.isString(relativeUrl)) {
    throw new Error('argument#0 "relativeUrl" required string');
  }

  // 获取 base 标签的 href 属性值
  var basePath = jQuery('base').attr('href');

  // basePath 规范成 "/" 结尾
  if (Utils.isNullOrUndefined(basePath)) {
    basePath = '/';
  } else if (!basePath.endsWith('/')) {
    basePath = basePath + '/';
  }

  // relativeUrl 规范成不以 "/" 开头
  if (relativeUrl.startsWith('/')) {
    relativeUrl = relativeUrl.substring(1);
  }

  return (basePath + relativeUrl);
};

/**
 * @description 修改浏览器URL
 * @param {string} newUrl 
 */
BrowserUrl.setLocationUrl = function (newUrl) {
  if (!Utils.isString(newUrl)) {
    throw new Error('argument#0 "newUrl" required string');
  }

  location.href = newUrl;
};

/* SOURCE-CODE-END */

export { BrowserUrl };
