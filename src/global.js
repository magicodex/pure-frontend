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
  // 标签 key 的属性名
  tagKeyAttributeName: 'data-ui',
  // 主视图的样式类名
  mainViewClassName: 'pure-view-main',
  // 应用的 URL
  appUrl: '/'
};

// 全局多语言信息
Global.messages = {
  // 未知错误
  unknownError: 'UnKnown error',
  // 未找到视图名称/URL字符串/URL模式
  notFoundviewName: 'Not found viewName from response header',
  notFoundFullUrl: 'Not found fullUrl from response header',
  notFoundUrlPattern: 'Not found urlPattern from response header'
};

/* SOURCE-CODE-END */

export { Global };
