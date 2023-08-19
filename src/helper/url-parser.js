"use strict";

import { Utils } from '../utils';

/* SOURCE-CODE-START */

/**
 * URL解析器
 * @class
 */
function UrlParser() {
  //
}

/**
 * @description 解析所有参数
 * @param {string} fullUrl 完整的URL字符串
 * @param {string} urlPattern URL模式
 * @returns {object}
 */
UrlParser.parseAllParams = function (fullUrl, urlPattern) {
  if (Utils.isNullOrUndefined(fullUrl)) {
    throw new Error('argument#0 "fullUrl" is null/undefined');
  }

  if (Utils.isNullOrUndefined(urlPattern)) {
    throw new Error('argument#1 "urlPattern" is null/undefined');
  }

  var pathParams = UrlParser.parsePathParams(fullUrl, urlPattern);
  var queryParams = UrlParser.parseQueryParams(fullUrl);
  var urlParams = Utils.concatObjects(pathParams, queryParams);

  return urlParams;
};

/**
 * @description 解析路径参数
 * @param {string} fullUrl 完整的URL字符串
 * @param {string} urlPattern URL模式
 * @returns {object}
 */
UrlParser.parsePathParams = function (fullUrl, urlPattern) {
  if (Utils.isNullOrUndefined(fullUrl)) {
    throw new Error('argument#0 "fullUrl" is null/undefined');
  }

  if (Utils.isNullOrUndefined(urlPattern)) {
    throw new Error('argument#1 "urlPattern" is null/undefined');
  }

  var pathUrl;
  var queryUrlIndex = fullUrl.indexOf('?');

  if (queryUrlIndex === 0) {
    return {};
  }

  if (queryUrlIndex > 0) {
    pathUrl = pageUrl.substring(0, queryUrlIndex);
  } else {
    pathUrl = fullUrl;
  }

  var urlParams = {};
  var pathUrlParts = pathUrl.split('/');
  var urlPatternParts = urlPattern.split('/');

  // 解析路径参数
  for (var index = 0; index < urlPatternParts.length; index++) {
    var urlPatternPart = urlPatternParts[index];

    if (urlPatternPart.startsWith('{') && urlPatternPart.endsWith('}')) {
      var endIndex = urlPatternPart.length - 1;
      var paramName = urlPatternPart.substring(1, endIndex);
      paramName = paramName.trim();
      var paramValue = globalUtils.emptyStringIfNullOrUndefined(pathUrlParts[index]);

      urlParams[paramName] = paramValue;
    }
  }

  return urlParams;
};

/**
 * @description 解析查询字符串参数
 * @param {string} fullUrl 完整的URL字符串
 * @returns {object}
 */
UrlParser.parseQueryParams = function (fullUrl) {
  if (Utils.isNullOrUndefined(fullUrl)) {
    throw new Error('argument#0 "fullUrl" is null/undefined');
  }

  var queryUrlIndex = fullUrl.indexOf('?');
  if (queryUrlIndex < 0 || (queryUrlIndex + 1) === pageUrl.length) {
    return {}
  }

  var urlParams = {};
  var queryUrl = fullUrl.substring(queryUrlIndex + 1);
  var queryUrlParts = queryUrl.split('&');

  // 解析查询参数
  for (var index = 0; index < queryUrlParts.length; index++) {
    var queryUrlPart = queryUrlParts[index];
    var nameValues = queryUrlPart.split('=');
    var paramName = nameValues[0];
    paramName = paramName.trim();
    var paramValue = globalUtils.emptyStringIfNullOrUndefined(nameValues[1]);
    paramValue = paramValue.trim();

    urlParams[paramName] = decodeURIComponent(paramValue);
  }

  return urlParams;
};

/* SOURCE-CODE-END */

export { UrlParser };
