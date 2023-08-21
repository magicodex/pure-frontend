"use strict";

/*!
 * pure-frontend v1.2.1 (https://gitee.com/magicodex/pure-frontend)
 * Licensed under MIT (https://gitee.com/magicodex/pure-frontend/blob/master/LICENSE)
 */



/**
 * @class
 */
function Global() {
  //
}

// 全局配置
Global.config = {
  // uiName 属性名称
  uiNameAttributeName: 'data-pure-ui-name',
  // viewStatus 属性名称
  viewStatusAttributeName: 'data-pure-view-status',
  // viewIndex 属性名称
  viewIndexAttributeName: 'data-pure-view-index',
  // tabIndex 属性名称
  tabIndexAttributeName: 'data-pure-tab-index',
  // 单页面基本URL
  singlePageBaseUrl: '/'
};

// 全局多语言信息
Global.messages = {
  // 未知错误
  unknownError: 'UnKnown error',
  // 未找到视图名称
  notFoundviewName: 'Not found viewName from response header',
  // 未找到URL字符串
  notFoundFullUrl: 'Not found fullUrl from response header',
  // 未找到URL模式
  notFoundUrlPattern: 'Not found urlPattern from response header'
};




/**
 * 工具类
 * @class
 */
function Utils() {
  //
}

/**
 * @description 判断给定参数的值是不是字符串类型
 * @param {*} [arg] 
 * @returns {boolean} 若给定参数的值是字符串则返回 true, 否则返回 false 
 */
Utils.isString = function (arg) {
  return (typeof arg === 'string');
};

/**
 * @description 判断给定参数的值是不是数字类型
 * @param {*} [arg] 
 * @returns {boolean} 若给定参数的值是数字则返回 true, 否则返回 false 
 */
Utils.isNumber = function (arg) {
  return (typeof arg === 'number');
};

/**
 * @param {*} [arg] 判断给定参数的值是不是对象(包括 null 值)
 * @returns {boolean} 若给定参数的值是对象则返回 true, 反则返回 false
 */
Utils.isObject = function (arg) {
  return (typeof arg === 'object');
};

/**
 * @description 判断给定参数的值是不是函数
 * @param {*} [arg] 
 * @returns {boolean} 若给定参数的值是函数则返回 true, 反则返回 false
 */
Utils.isFunction = function (arg) {
  return (typeof arg === 'function');
};

/**
 * @description 判断给定参数的值是不是 null/undefined
 * @param {*} [arg] 
 * @returns {boolean} 若给定参数的值是 null/undefined 则返回 true, 否则返回 false
 */
Utils.isNullOrUndefined = function (arg) {
  return (arg === null || arg === undefined);
};

/**
 * @description 判断给定参数的值是不是空字符
 * @param {*} [arg] 
 * @returns {boolean} 若给定参数的值不是空字符串则返回 true, 否则返回 false
 */
Utils.isNotEmptyString = function (arg) {
  return (Utils.isString(arg) && arg.length > 0);
};

/**
 * @description 判断给定参数的值是不是空对象
 * @param {*} [arg]
 * @returns {boolean} 若给定参数的值不是空对象则返回 true, 否则返回 false
 */
Utils.isNotEmptyObject = function (arg) {
  if (Utils.isNullOrUndefined(arg) || !Utils.isObject(arg)) {
    return false;
  }

  for (var key in arg) {
    return true;
  }

  return false;
};

/**
 * @description 若第一个参数不是 null/undefined 则返回第一个参数，否则返回空字符串
 * @param {*} [arg]
 * @returns {string}
 */
Utils.emptyStringIfNullOrUndefined = function (arg) {
  if (Utils.isNullOrUndefined(arg)) {
    return '';
  }

  return arg;
};

/**
 * @description 若第一个参数不是 null/undefined 则返回第一个参数，否则返回空数组
 * @param {*} [arg]
 * @returns {Array}
 */
Utils.emptyArrayIfNullOrUndefined = function (arg) {
  if (Utils.isNullOrUndefined(arg)) {
    return [];
  }

  return arg;
};

/**
 * @description 若第一个参数不是 null/undefined 则返回第一个参数，否则返回空对象
 * @param {*} [arg]
 * @returns {object}
 */
Utils.emptyObjectIfNullOrUndefined = function (arg) {
  if (Utils.isNullOrUndefined(arg)) {
    return {};
  }

  return arg;
};

/**
 * @description 转换给定参数的值成字符串
 * @param {*} [arg]
 * @returns {string} 若参数的值不是 null/undefined 则返回字符串，否则返回 null/undefined
 */
Utils.convertToString = function (arg) {
  if (typeof arg === 'string') {
    return arg;
  }

  if (Utils.isNullOrUndefined(arg)) {
    return arg;
  }

  return String(arg);
};

/**
 * @description 根据给定的字符串格式和参数做字符串格式化
 * @param {string} format 字符串格式的占位符是 {0}、{1}、{2} ...
 * @param {(string[]|...string)} args
 * @returns {string} 返回字符串格式化后的字符串
 */
Utils.formatString = function (format, objectArray) {
  if (Utils.isNullOrUndefined(format)) {
    throw new Error('argument#0 "format" is null/undefined');
  }

  if (!Utils.isString(format)) {
    throw new Error('argument#0 "format" required string');
  }

  if (!(objectArray instanceof Array)) {
    objectArray = [];

    for (var index = 1; index < arguments.length; index++) {
      objectArray.push(arguments[index]);
    }
  }

  // 替换占位符 {数字}
  var newString = format.replace(/\{([0-9]+)\}/g, function (match, index) {
    var argIndex = parseInt(index);
    var arg = objectArray[argIndex];

    return (Utils.convertToString(arg) || '');
  });

  return newString;
};

/**
 * @description 合并多个对象的字段到新的对象上
 * @param {(object[]|...object)} objectArray 
 * @returns {object}
 */
Utils.concatObjects = function (objectArray) {
  if (!(objectArray instanceof Array)) {
    objectArray = arguments;
  }

  var newObj = {};

  for (var index = 0; index < objectArray.length; index++) {
    var obj = objectArray[index];

    for (var key in obj) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
};




/**
 * 序列生成器
 * @class
 * @param {number} [initValue] 
 */
function SequenceGenerator(initValue) {
  if (arguments.length > 0) {
    this._value = initValue;
  } else {
    this._value = 1;
  }
}

/**
 * @description 返回下一个值
 * @returns {number}
 */
SequenceGenerator.prototype.nextValue = function () {
  var nextValue = this._value;
  this._value++;

  return nextValue;
};




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
    pathUrl = fullUrl.substring(0, queryUrlIndex);
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
      var paramValue = Utils.emptyStringIfNullOrUndefined(pathUrlParts[index]);

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
  if (queryUrlIndex < 0 || (queryUrlIndex + 1) === fullUrl.length) {
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
    var paramValue = Utils.emptyStringIfNullOrUndefined(nameValues[1]);
    paramValue = paramValue.trim();

    urlParams[paramName] = decodeURIComponent(paramValue);
  }

  return urlParams;
};




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




/**
 * 视图
 * @class
 * @param {(Document|Element)} viewElement 
 * @param {ViewInfo} viewInfo 
 */
function View(viewElement, viewInfo) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  if (Utils.isNullOrUndefined(viewInfo)) {
    throw new Error('argument#1 "viewInfo is null/undefined');
  }

  this._viewElement = viewElement;
  this._viewInfo = viewInfo;
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




/**
 * 视图信息
 * @class
 */
function ViewInfo() {
  // 视图名称
  this._viewName = null;
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

  var viewInfo = new ViewInfo();
  viewInfo.setViewName(viewName);
  viewInfo.setFullUrl(fullUrl);
  viewInfo.setUrlPattern(urlPattern);

  return viewInfo;
};




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




/**
 * 视图管理器
 * @class
 */
function ViewManager() {
  //
}

ViewManager.viewScopes = {};
ViewManager.currentTab = { tabIndex: 'default' };
ViewManager.sequenceGenerator = new SequenceGenerator(100001);
ViewManager.appSelector = '.pure-app';

ViewManager.VIEW_STATUS_LOADING = 'loading';
ViewManager.VIEW_STATUS_SHOW = 'show';
ViewManager.VIEW_STATUS_HIDDEN = 'hidden';
ViewManager.VIEW_STATUS_DESTROY = 'destroy';

/**
 * @description 返回指定的视图作用域
 * @param {string} viewName 视图名
 * @param {boolean} [allowCreate=true]
 * @returns {object}
 */
ViewManager.getViewScope = function (viewName, allowCreate) {
  if (!Utils.isString(viewName)) {
    throw new Error('argument#0 "viewName" required string');
  }

  allowCreate = !(allowCreate === false);
  var viewScope = ViewManager.viewScopes[viewName];

  if (Utils.isNullOrUndefined(viewScope) && allowCreate) {
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

  var jqViewParent = jQuery(ViewManager.appSelector);
  var viewSelector = Utils.formatString('main[{0}="{1}"]',
    [Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex]);
  var jqView = jqViewParent.children(viewSelector);

  // 加载新的视图
  ViewManager.doRenderView(url, function () {
    // 结束新视图之前所有视图的生命周期
    jqView.each(function (index, viewElement) {
      ViewManager.stopViewLifecycle(viewElement);
    });
  });
};

/**
 * @description 加载视图并添加到栈中
 * @param {string} url URL字符串
 */
ViewManager.pushView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqViewParent = jQuery(ViewManager.appSelector);
  var viewSelector = Utils.formatString('main[{0}="{1}"]:first',
    [Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_SHOW]);
  var jqCurrentView = jqViewParent.children(viewSelector);

  // 加载新的视图
  ViewManager.doRenderView(url, function () {
    if (jqCurrentView.length > 0) {
      // 隐藏新视图之前的视图
      ViewManager.hiddenView(jqCurrentView[0]);
    }
  });
};

/**
 * @description 从栈顶移除视图并显示该视图
 * @param {string} url URL字符串
 */
ViewManager.popView = function (url) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqViewParent = jQuery(ViewManager.appSelector);
  var viewSelector = Utils.formatString('main[{0}="{1}"]',
    [Global.config.tabIndexAttributeName,
    ViewManager.currentTab.tabIndex]);
  var jqView = jqViewParent.children(viewSelector);

  if (jqView.length >= 2) {
    // 结束当前视图的生命周期
    ViewManager.stopViewLifecycle(jqView[0]);
    // 恢复上个视图
    ViewManager.showView(jqView[1]);
  } else {
    // 加载新的视图
    ViewManager.doRenderView(url, function () {
      if (jqView.length >= 1) {
        // 结束当前视图的生命周期
        ViewManager.stopViewLifecycle(jqView[0]);
      }
    });
  }
};

/**
 * @description 加载视图
 * @param {string} url URL字符串
 * @param {function} [callbackFn]
 */
ViewManager.doRenderView = function (url, callbackFn) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var jqViewParent = jQuery(ViewManager.appSelector);
  var viewSelector = Utils.formatString('main[{0}="{1}"][{2}="{3}"]',
    [Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex,
    Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_LOADING]);
  var jqView = jqViewParent.find(viewSelector);

  if (jqView.length > 0) {
    return;
  }

  var jqNewView = jQuery('<main class="pure-view"></main>');
  jqNewView.attr(Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_LOADING);
  jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
  jqNewView.css('visibility', 'hidden');
  jqNewView.prependTo(jqViewParent);

  // 创建视图加载器
  var viewLoader = new ViewLoader(jqNewView[0], function (viewScope, view) {
    var sequenceNumber = ViewManager.sequenceGenerator.nextValue();
    var viewInfo = view.getViewInfo();
    var viewName = viewInfo.getViewName();
    var viewIndex = viewName + '_' + sequenceNumber;
    // 记录视图索引
    jqNewView.attr(Global.config.viewIndexAttributeName, viewIndex);

    // 修改视图作用域的名称以支持同时加载多个相同的视图
    if (!Utils.isNullOrUndefined(viewScope)) {
      ViewManager.setViewScope(viewIndex, viewScope);
      ViewManager.removeViewScope(viewName);
    }

    if (!Utils.isNullOrUndefined(callbackFn)) {
      callbackFn();
    }

    // 开启视图生命周期
    ViewManager.startViewLifecycle(jqNewView[0]);
  });

  // 加载视图
  viewLoader.loadView(url);
};

/**
 * @description 开启视图生命周期
 * @param {(Document|Element)} viewElement 
 */
ViewManager.startViewLifecycle = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  var jqView = jQuery(viewElement);
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);
  var tabIndex = jqView.attr(Global.config.tabIndexAttributeName);
  var viewStatus = jqView.attr(Global.config.viewStatusAttributeName);

  if (viewStatus === ViewManager.VIEW_STATUS_DESTROY) {
    // 移除该视图对应的作用域
    ViewManager.removeViewScope(viewIndex);

    return;
  }

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewLifecycleStart = viewScope.onViewLifecycleStart;

      if (!Utils.isNullOrUndefined(onViewLifecycleStart)) {
        // 视图生命周期开启时调用
        onViewLifecycleStart();
      }
    }
  }

  if (tabIndex === ViewManager.currentTab.tabIndex) {
    // 显示视图
    ViewManager.showView(viewElement);
  } else {
    // 隐藏视图
    ViewManager.hiddenView(viewElement);
  }
};

/**
 * @description 结束视图生命周期
 * @param {(Document|Element)} viewElement 
 */
ViewManager.stopViewLifecycle = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  // 隐藏视图
  ViewManager.hiddenView(viewElement);

  var jqView = jQuery(viewElement);
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);
  var viewStatus = jqView.attr(Global.config.viewStatusAttributeName);

  if (!(viewStatus === ViewManager.VIEW_STATUS_HIDDEN || viewStatus === ViewManager.VIEW_STATUS_LOADING)) {
    return;
  }

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!(viewStatus === ViewManager.VIEW_STATUS_LOADING) && !Utils.isNullOrUndefined(viewScope)) {
      var onViewLifecycleEnd = viewScope.onViewLifecycleEnd;

      if (!Utils.isNullOrUndefined(onViewLifecycleEnd)) {
        // 视图生命周期结束时调用
        onViewLifecycleEnd();
      }

      // 移除该视图对应的作用域
      ViewManager.removeViewScope(viewIndex);
    }
  }

  jqView.attr(Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_DESTROY);
  // 移除该视图对应的 DOM 元素
  jqView.remove();
};

/**
 * @description 显示视图
 * @param {(Document|Element)} targetElement 
 */
ViewManager.showView = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  var jqView = jQuery(viewElement);
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);
  var viewStatus = jqView.attr(Global.config.viewStatusAttributeName);

  if (!(viewStatus === ViewManager.VIEW_STATUS_LOADING || viewStatus === ViewManager.VIEW_STATUS_HIDDEN)) {
    return;
  }

  // 设置该视图成可见
  jqView.attr(Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_SHOW);
  jqView.css('visibility', 'visible');

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!Utils.isNullOrUndefined(viewScope)) {
      var onViewShow = viewScope.onViewShow;

      if (!Utils.isNullOrUndefined(onViewShow)) {
        // 视图显示时调用
        onViewShow();
      }
    }
  }
};

/**
 * @description 隐藏视图
 * @param {(Document|Element)} viewElement 
 */
ViewManager.hiddenView = function (viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  var jqView = jQuery(viewElement);
  var viewIndex = jqView.attr(Global.config.viewIndexAttributeName);
  var viewStatus = jqView.attr(Global.config.viewStatusAttributeName);

  if (!(viewStatus === ViewManager.VIEW_STATUS_SHOW || viewStatus === ViewManager.VIEW_STATUS_LOADING)) {
    return;
  }

  if (Utils.isNotEmptyString(viewIndex)) {
    var viewScope = ViewManager.getViewScope(viewIndex, false);

    if (!(viewStatus === ViewManager.VIEW_STATUS_LOADING) && !Utils.isNullOrUndefined(viewScope)) {
      var onViewHidden = viewScope.onViewHidden;

      if (!Utils.isNullOrUndefined(onViewHidden)) {
        // 视图隐藏时调用
        onViewHidden();
      }
    }
  }

  // 设置该视图成不可见
  jqView.attr(Global.config.viewStatusAttributeName, ViewManager.VIEW_STATUS_HIDDEN);
  jqView.css('visibility', 'hidden');
};




/**
 * 视图遮罩层
 * @class
 * @param {(Document|Element)} viewElement 
 */
function ViewMask(viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  this._viewElement = viewElement;
}

/**
 * @description 显示遮罩层
 */
ViewMask.prototype.showMask = function () {
  var jqElement = jQuery(this._viewElement);

  jqElement.prepend('<div class="pure-view-mask"><div></div></div>')
};

/**
 * @description 隐藏遮罩层
 */
ViewMask.prototype.hiddenMask = function () {
  var jqElement = jQuery(this._viewElement);

  jqElement.find('.pure-view-mask').remove();
};




/**
 * Ajax结果
 * @class
 * @param {jQuery.Deferred} deferred 
 * @param {(Document|Element)} [sourceElement] 
 */
function AjaxResult(deferred, sourceElement) {
  if (Utils.isNullOrUndefined(deferred)) {
    throw new Error('argument#0 "deferred" is null/undefined');
  }

  this._deferred = deferred;
  this._sourceElement = sourceElement;
}

/**
 * @description 处理调用结果
 * @param {function} doneFn 
 * @param {function} failFn 
 * @returns {jQuery.Deferred}
 */
AjaxResult.prototype.thenResult = function (doneFn, failFn) {
  return this.doHandleResult(doneFn, failFn, false);
};

/**
 * @description 处理调用结果
 * @param {function} doneFn 
 * @param {function} failFn 
 * @returns {jQuery.Deferred}
 */
AjaxResult.prototype.waitResult = function (doneFn, failFn) {
  return this.doHandleResult(doneFn, failFn, true);
};

/**
 * @description 处理调用结果
 * @param {function} doneFn 
 * @param {function} failFn 
 * @param {boolean} showMask 
 * @returns {jQuery.Deferred}
 */
AjaxResult.prototype.doHandleResult = function (doneFn, failFn, showMask) {
  if (!Utils.isFunction(doneFn)) {
    throw new Error('argument#1 "doneFn" required function');
  }

  if (Utils.isNullOrUndefined(failFn)) {
    // 默认的错误处理
    failFn = function (jqXHR, textStatus, errorThrown) {
      AjaxResult.handleAjaxError(this._sourceElement, jqXHR, textStatus, errorThrown);
    };
  }

  var deferred = this._deferred;

  if (showMask && !Utils.isNullOrUndefined(this._sourceElement)) {
    var viewMask = new ViewMask(this._sourceElement);
    // 显示遮罩层
    viewMask.showMask();

    deferred.always(function () {
      // 在请求完成时隐藏遮罩层
      viewMask.hiddenMask();
    });
  }

  if (jQuery.ajaxSettings.async === false) {
    if (deferred.status === 200) {
      var data = (deferred.responseJSON || responseText);
      doneFn(data, 'success', deferred);
    } else {
      if (deferred.statusText === 'timeout') {
        failFn(deferred, 'timeout', 'timeout');
      } else {
        failFn(deferred, 'error', '');
      }
    }

    return deferred;
  } else {
    return deferred.then(doneFn, failFn);
  }
};

/**
 * @description 处理 AJAX 错误
 * @param {(Document|Element)} sourceElement
 * @param {jQuery.jqXHR} jqXHR 
 * @param {string} textStatus 
 * @param {string} errorThrown 
 */
AjaxResult.handleAjaxError = function (sourceElement, jqXHR, textStatus, errorThrown) {
  if (Utils.isNullOrUndefined(jqXHR)) {
    throw new Error('argument#0 "jqXHR" is null/undefined');
  }

  var message;

  if (!Utils.isNullOrUndefined(jqXHR.responseJSON)) {
    message = jqXHR.responseJSON.message;
  }

  App.showError(message || Global.message.unknownError);
};




/**
 * @class
 * @param {(Document|Element)} [sourceElement] 
 */
function AjaxCallService(sourceElement) {
  this._sourceElement = sourceElement;
}

/**
 * @description 调用远程接口
 * @param {string} url 
 * @param {*} [data] 
 * @param {PlainObject} [opts] 
 * @returns {AjaxResult}
 */
AjaxCallService.prototype.callService = function (url, data, opts) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  data = Utils.emptyObjectIfNullOrUndefined(data);
  opts = Utils.emptyObjectIfNullOrUndefined(opts);
  var dataStr = JSON.stringify(data);

  var initOpts = {
    url: url,
    type: 'POST',
    cache: false,
    contentType: 'application/json',
    dataType: 'json',
    data: dataStr,
    beforeSend: this.beforeSend,
    error: function (jqXHR, textStatus, errorThrown) {
      // 覆盖全局的错误处理
    }
  };

  var newOpts = Utils.concatObjects([initOpts, opts]);
  var deferred = jQuery.ajax(newOpts);
  var ajaxResult = new AjaxResult(deferred, this._sourceElement);

  return ajaxResult;
};

/**
 * @description 发送请求前调用
 * @param {jQuery.jqXHR} jqXHR 
 * @param {PlainObject} settings 
 */
AjaxCallService.prototype.beforeSend = function (jqXHR, settings) {
  //
};




/**
 * @class
 */
function Ajax() {
  //
}

/**
 * @description 调用远程接口
 * @param {string} url 
 * @param {*} [data] 
 * @param {PlainObject} [opts] 
 * @returns {AjaxResult}
 */
Ajax.callService = function (url, data, opts) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var ajaxCallService = new AjaxCallService();

  return ajaxCallService.callService(url, data, opts);
};




/**
 * @class
 */
function AppAlertMessages() {
  //
}

/**
 * @description 显示信息
 * @param {string} message 
 */
AppAlertMessages.showMessage = function (message) {
  message = Utils.emptyStringIfNullOrUndefined(message);

  var format = '<div class="alert alert-success pure-app-alert" role="alert">{0}</div>';
  var html = Utils.formatString(format, [message]);
  var jqElement = jQuery(html).prependTo('body');

  jqElement.delay(1000).fadeOut('fast', function () {
    jqElement.remove();
  });
};

/**
 * @description 显示错误信息
 * @param {string} message 
 */
AppAlertMessages.showError = function (message) {
  message = Utils.emptyStringIfNullOrUndefined(message);

  var format = '<div class="alert alert-warning pure-app-alert" role="alert">{0}</div>';
  var html = Utils.formatString(format, [message]);
  var jqElement = jQuery(html).prependTo('body');

  jqElement.delay(2000).fadeOut('fast', function () {
    jqElement.remove();
  });
};





/**
 * @class
 */
function App() {
  //
}

/**
 * @description 初始视图作用域
 * @param {string} viewName 
 * @param {function} callbackFn 
 */
App.viewScope = function (viewName, callbackFn) {
  if (!Utils.isString(viewName)) {
    throw new Error('argument#0 "viewName" required string');
  }

  if (!Utils.isFunction(callbackFn)) {
    throw new Error('argument#1 "callbackFn" required function');
  }

  var viewScope = ViewManager.getViewScope(viewName);
  // 调用回调函数初始作用域
  callbackFn(viewScope);
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

  var viewScope = ViewManager.getViewScope(viewName);
  // 设置主函数
  viewScope.main = mainFn;
};

/**
 * @description 显示信息
 * @param {string} message 
 */
App.showMessage = function (message) {
  AppAlertMessages.showError(message);
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





/**
 * @namespace Pure
 */

var Pure = {
  utils: Utils,
  app: App,
  config: Global.config,
  messages: Global.messages,
  fn: {
    Global: Global,
    Utils: Utils,
    SequenceGenerator: SequenceGenerator,
    UrlParser: UrlParser,
    BrowserUrl: BrowserUrl,
    View: View,
    ViewInfo: ViewInfo,
    ViewResponse: ViewResponse,
    ViewLoader: ViewLoader,
    ViewManager: ViewManager,
    ViewMask: ViewMask,
    AjaxResult: AjaxResult,
    AjaxCallService: AjaxCallService,
    Ajax: Ajax,
    AppAlertMessages: AppAlertMessages,
    App: App
  }
};



module.exports = Pure;
