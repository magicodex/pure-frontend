# pure-frontend

解决单页面应用开发中常见的问题，比如不同视图间的样式隔离、JS隔离等。

## 安装依赖
```
npm install pure-frontend
```

## 添加依赖

依赖 jQuery，Bootstrap v4。
```
<link href="pure-frontend.css" rel="stylesheet" />
  
<script src="pure-frontend.js" type='text/javascript'></script>
```

## 代码示例

比如有这么一段 HTML 代码。
```
<body>
  ...
  <div class="pure-app">
  </div>
  ...
</body>
```
*加载的视图会渲染到包含 pure-app 样式类名的标签下。*

```
/**
 * @description 加载视图
 * @param {string} url URL字符串
 */
Pure.app.loadView(url);     

/**
 * @description 注册视图的入口函数
 * @param {string} viewName 
 * @param {function} mainFn 
 */
Pure.app.viewMain(viewName, function (scope, view) {
  // 加载完视图后会自动执行该函数
  ...
});

/**
 * @description 调用远程接口
 * @param {string} url 
 * @param {*} [data] 
 * @param {PlainObject} [opts] 
 * @returns {AjaxResult}
 */
Pure.fn.Ajax.callService(url, data, opts);
```

提供访问视图的方法描述。
```
class View {
  /**
   * @param {(Document|Element)} viewElement 
   * @param {ViewInfo} viewInfo 
   */
  constructor(viewElement: any, viewInfo: any, viewScope: any);

  /**
   * @description 返回视图对应的 DOM 元素
   * @returns {(Document|Element)}
   */
  getViewElement(): any;

  /**
   * @description 返回视图信息
   * @returns {ViewInfo}
   */
  getViewInfo(): any;

  /**
   * @description 返回视图对应的数据模型
   * @returns {uiData.Model}
   */
  getDataModel(): any;

  /**
   * @description 返回 URL 参数
   * @param {string} name 
   * @returns {string}
   */
  getUrlParam(name: any): any;

  /**
   * @description 查找视图下的指定元素，参数格式与 jQuery.find() 相同
   * @param {...any} args
   * @returns {jQuery}
   */
  $find(...args: any[]): any;

  /**
   * @description 查找视图下的指定元素，通过配置 Global.config.uiNameAttributeName 指定的属性
   * @param {string} name
   * @returns {jQuery}
   */
  $ui(name: any): any;

  ...
}
```

## 开源协议

MIT
