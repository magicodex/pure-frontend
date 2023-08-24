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
  unknownError: 'Unknown error!',
  // 未找到视图名称
  notFoundviewName: 'Not found viewName from response header!',
  // 未找到URL字符串
  notFoundFullUrl: 'Not found fullUrl from response header!',
  // 未找到URL模式
  notFoundUrlPattern: 'Not found urlPattern from response header!'
};

/* SOURCE-CODE-END */

export { Global };
