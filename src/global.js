"use strict";

/* SOURCE-CODE-START */

/**
 * @class
 */
function Global() {
  //
}

// 全局配置
Global.config = {
  // 单页面基本URL
  singlePageBaseUrl: '/',
  // viewIndex 属性名称
  viewIndexAttributeName: 'data-pure-view-index',
  // viewTitle 属性名称
  viewTitleAttributeName: 'data-pure-view-title',
  // viewName 属性名称
  viewNameAttributeName: 'data-pure-view-name',
  // viewUrl 属性名称
  viewUrlAttributeName: 'data-pure-view-url',
  // viewLoaded 属性名称
  viewLoadedAttributeName: 'data-pure-view-loaded',
  // viewStatus 属性名称
  viewStatusAttributeName: 'data-pure-view-status',
  // uiName 属性名称
  uiNameAttributeName: 'data-pure-ui-name',
  // tabIndex 属性名称
  tabIndexAttributeName: 'data-pure-tab-index',
  // 视图名称响应头属性
  viewNameHeaderName: 'x-page-code',
  // 视图标题响应头属性
  viewTitleHeaderName: 'x-page-name',
  // 视图 URL 路径响应头属性
  fullUrlHeaderName: 'x-page-url',
  // 视图 URL 模式响应头属性
  urlPatternHeaderName: 'x-url-pattern'
};

// 全局多语言信息
Global.messages = {
  // 未知错误
  unknownError: 'Unknown error!',
  // 未找到视图名称
  notFoundviewName: 'Not found viewName from response header!',
  // 未找到URL字符串
  notFoundFullUrl: 'Not found fullUrl from response header!',
  // 未找到URL模式
  notFoundUrlPattern: 'Not found urlPattern from response header!'
};

// 全局常量
Global.constants = {
  // 视图已加载完成
  VIEW_LOADED_TRUE: 'true',
  // 视图未加载完成
  VIEW_LOADED_FALSE: 'false',
  // 视图加载出错
  VIEW_LOADED_ERROR: 'error',
  // 视图加载状态
  VIEW_STATUS_INIT: 'init',
  // 视图准备状态
  VIEW_STATUS_READY: 'ready',
  // 视图活跃状态
  VIEW_STATUS_SHOW: 'show',
  // 视图隐藏状态
  VIEW_STATUS_HIDDEN: 'hidden',
  // 视图销毁状态
  VIEW_STATUS_DESTROY: 'destroy'
};

/* SOURCE-CODE-END */

export { Global };
