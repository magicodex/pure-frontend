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

ViewResponse.viewNameHeaderName = 'x-page-code';
ViewResponse.viewTitleHeaderName = 'x-page-name';
ViewResponse.fullUrlHeaderName = 'x-page-url';
ViewResponse.urlPatternHeaderName = 'x-url-pattern';

/**
 * @description 返回视图信息
 * @returns {ViewInfo}
 */
ViewResponse.prototype.getViewInfo = function () {
  var viewName = this._jqXHR.getResponseHeader(ViewResponse.viewNameHeaderName);
  if (Utils.isNullOrUndefined(viewName)) {
    throw new Error(Global.messages.notFoundviewName);
  }

  var fullUrl = this._jqXHR.getResponseHeader(ViewResponse.fullUrlHeaderName);
  if (Utils.isNullOrUndefined(fullUrl)) {
    throw new Error(Global.messages.notFoundFullUrl);
  }

  var urlPattern = this._jqXHR.getResponseHeader(ViewResponse.urlPatternHeaderName);
  if (Utils.isNullOrUndefined(urlPattern)) {
    throw new Error(Global.messages.notFoundUrlPattern);
  }

  var viewTitle = this._jqXHR.getResponseHeader(ViewResponse.viewTitleHeaderName);
  if (Utils.isNotEmptyString(viewTitle)) {
    viewTitle = decodeURIComponent(viewTitle);
  }

  var viewInfo = new ViewInfo();
  viewInfo.setViewName(viewName);
  viewInfo.setViewTitle(viewTitle);
  viewInfo.setFullUrl(fullUrl);
  viewInfo.setUrlPattern(urlPattern);

  return viewInfo;
};

/* SOURCE-CODE-END */

export { ViewResponse };
