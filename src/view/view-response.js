"use strict";

import { Utils } from '../utils';
import { Global } from '../global';
import { ViewInfo } from './view-info';

/* SOURCE-CODE-START */

/**
 * 视图响应
 * @class
 */
function ViewResponse(url, jqXHR) {
  if (Utils.isNullOrUndefined(url)) {
    throw new Error('argument#0 "url" is null/undefined');
  }

  if (Utils.isNullOrUndefined(jqXHR)) {
    throw new Error('argument#1 "jqXHR" is null/undefined');
  }

  this._url = url;
  this._jqXHR = jqXHR;
}

/**
 * @description 返回视图信息
 * @returns {ViewInfo}
 */
ViewResponse.prototype.getViewInfo = function () {
  var viewName = this.getViewName();
  var viewTitle = this.getViewTitle();
  var fullUrl = this.getFullUrl();
  var urlPattern = this.getUrlPattern();

  var viewInfo = new ViewInfo();
  viewInfo.setViewName(viewName);
  viewInfo.setViewTitle(viewTitle);
  viewInfo.setFullUrl(fullUrl);
  viewInfo.setUrlPattern(urlPattern);

  return viewInfo;
};

ViewResponse.prototype.getViewName = function() {
  var viewName = this._jqXHR.getResponseHeader(Global.config.viewNameHeaderName);
  if (Utils.isNullOrUndefined(viewName)) {
    //throw new Error(Global.messages.notFoundviewName);
    viewName = this._url;
  }

  return viewName;
};

ViewResponse.prototype.getViewTitle = function() {
  var viewTitle = this._jqXHR.getResponseHeader(Global.config.viewTitleHeaderName);
  if (Utils.isNotEmptyString(viewTitle)) {
    viewTitle = decodeURIComponent(viewTitle);
  }

  return viewTitle;
};

ViewResponse.prototype.getFullUrl = function() {
  var fullUrl = this._jqXHR.getResponseHeader(Global.config.fullUrlHeaderName);
  if (Utils.isNullOrUndefined(fullUrl)) {
    //throw new Error(Global.messages.notFoundFullUrl);
    fullUrl = "";
  }

  return fullUrl;
};

ViewResponse.prototype.getUrlPattern = function() {
  var urlPattern = this._jqXHR.getResponseHeader(Global.config.urlPatternHeaderName);
  if (Utils.isNullOrUndefined(urlPattern)) {
    //throw new Error(Global.messages.notFoundUrlPattern);
    urlPattern = ""
  }

  return urlPattern;
};

/* SOURCE-CODE-END */

export { ViewResponse };
