
"use strict";

QUnit.module('ViewLoader', function () {
  var ViewLoader = Pure.fn.ViewLoader;
  var Global = Pure.fn.Global;
  var BrowserUrl = Pure.fn.BrowserUrl;
  var ViewScopeManager = Pure.fn.ViewScopeManager;
  var SequenceGenerator = Pure.fn.SequenceGenerator;

  QUnit.test('test', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'loading');
    jqNewView.css('visibility', 'hidden');
    jqNewView.prependTo(jqTest);

    var callbacnFnCalledFlag = false;
    var mainFnCalledFlag = false;
    var newLocationUrl = null;
    var newViewScope = null;
    var newView = null;
    var oldSetLocationUrl = BrowserUrl.setLocationUrl;

    try {
      // 重置上下文
      ViewLoader.sequenceGenerator = new SequenceGenerator(100001);
      ViewLoader.lastViewInfo = {};
      ViewScopeManager.viewScopes = {
        'viewName1': {
          main: function (scope, view) {
            mainFnCalledFlag = true;
          }
        }
      };

      // 避免浏览器跳转
      BrowserUrl.setLocationUrl = function (newUrl) {
        newLocationUrl = newUrl;
      };

      // 模拟 jqXHR 对象
      var mockJqXHR = {
        responseHeaders: {
          'x-page-code': 'viewName1',
          'x-page-url': '/url/100001',
          'x-url-pattern': '/url/{id}'
        },
        getResponseHeader: function (headerName) {
          return this.responseHeaders[headerName];
        }
      };

      var viewLoader = new ViewLoader(jqNewView[0], function (success, view, viewScope) {
        callbacnFnCalledFlag = true;
        newViewScope = viewScope;
        newView = view;
      });
      var htmlString = '<div><label for="id1">Name:</label><input id="id1" type="text"/></div>';
      // 调用方法
      viewLoader.renderView('/url/100001', htmlString, null, mockJqXHR);

      // 检查调整后的 id 属性值
      assert.strictEqual(jqTest.find('label').attr('for'), 'id1_100001');
      assert.strictEqual(jqTest.find('input').attr('id'), 'id1_100001');

      assert.deepEqual(ViewLoader.lastViewInfo.viewScope, newViewScope);
      assert.deepEqual(ViewLoader.lastViewInfo.view, newView);
      assert.strictEqual(mainFnCalledFlag, true);
      assert.strictEqual(callbacnFnCalledFlag, true);
    } finally {
      ViewLoader.lastViewInfo = {};
      ViewLoader.sequenceGenerator = new SequenceGenerator(100001);
      ViewScopeManager.viewScopes = {};
      BrowserUrl.setLocationUrl = oldSetLocationUrl;
    }
  });

});

