# pure-frontend

## 添加依赖

pure-frontend 依赖 jQuery，Bootstrap v4。
```
<link href="pure-frontend.css" rel="stylesheet" />
  
<script src="pure-frontend.js" type='text/javascript'></script>
```

## 代码示例

比如有这么一段 HTML 代码
```
<body>
  ...
  <div class="pure-app">
  </div>
  ...
</body>
```
加载的视图会渲染到包含 pure-app 样式类名的标签下。

```
// 加载视图
Pure.app.loadView(url);     

// 注册视图的入口函数
Pure.app.viewMain(viewName, function (scope, view) {
  // 加载完视图后会自动执行该函数
  ...
});

// 调用远程接口
Pure.fn.Ajax.callService(url, data);

...
```

## 开源协议

MIT
