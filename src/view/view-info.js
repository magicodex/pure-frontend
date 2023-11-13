"use strict";

/* SOURCE-CODE-START */

/**
 * 视图信息
 * @class
 */
function ViewInfo() {
  // 视图名称
  this._viewName = null;
  // 视图标题
  this._viewTitle = null;
  // URL字符串
  this._fullUrl = null;
  // URL模式
  this._urlPattern = null;
}

ViewInfo.prototype.getViewName = function () {
  return this._viewName;
};

ViewInfo.prototype.setViewName = function (viewName) {
  this._viewName = viewName;
};

ViewInfo.prototype.getViewTitle = function () {
  return this._viewTitle;
};

ViewInfo.prototype.setViewTitle = function (viewTitle) {
  this._viewTitle = viewTitle;
};

ViewInfo.prototype.getFullUrl = function () {
  return this._fullUrl;
};

ViewInfo.prototype.setFullUrl = function (fullUrl) {
  this._fullUrl = fullUrl;
};

ViewInfo.prototype.getUrlPattern = function () {
  return this._urlPattern;
};

ViewInfo.prototype.setUrlPattern = function (urlPattern) {
  this._urlPattern = urlPattern;
};

/* SOURCE-CODE-END */

export { ViewInfo };
