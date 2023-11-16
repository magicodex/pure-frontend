
"use strict";

QUnit.module('ViewManager', function () {
  var ViewManager = Pure.fn.ViewManager;
  var Global = Pure.fn.Global;
  var BrowserUrl = Pure.fn.BrowserUrl;
  var ViewLoader = Pure.fn.ViewLoader;
  var SequenceGenerator = Pure.fn.SequenceGenerator;
  var ViewScopeManager = Pure.fn.ViewScopeManager;
  var View = Pure.fn.View;
  var ViewInfo = Pure.fn.ViewInfo;

  QUnit.test('doRenderView', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqViewParent = jQuery('<div class="pure-app"></div>');
    jqTest.append(jqViewParent);

    var oldLoadView = ViewLoader.prototype.loadView;
    var oldSetLocationUrl = BrowserUrl.setLocationUrl;
    try {
      // 重置上下文
      ViewLoader.sequenceGenerator = new SequenceGenerator(100001);
      ViewLoader.lastViewInfo = {};
      ViewManager.sequenceGenerator = new SequenceGenerator(100001);
      ViewScopeManager.viewScopes = {
        'viewName1': {
          'field1': 'value1',
          'field2': 'value2'
        }
      };

      // 避免浏览器跳转
      BrowserUrl.setLocationUrl = function (newUrl) {
        //
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

      // 模拟 ViewLoader 加载逻辑
      ViewLoader.prototype.loadView = function (url) {
        var htmlString = '<div><label for="id1">Name:</label><input id="id1" type="text"/></div>';
        this.renderView('/url/100001', htmlString, null, mockJqXHR);
      };

      // 调用方法
      ViewManager.doRenderView('/url/100001');


      var viewScope = ViewScopeManager.viewScopes['viewName1_100001'];
      assert.ok(viewScope.VIEW != null);
      delete viewScope.VIEW;
      // 检查调整后的视图作用域的名称
      assert.deepEqual(ViewScopeManager.viewScopes, {
        'viewName1_100001': {
          'field1': 'value1',
          'field2': 'value2'
        }
      });

      var jqNewView = jqViewParent.children().first();
      assert.strictEqual(jqNewView.attr(Global.config.tabIndexAttributeName), ViewManager.currentTab.tabIndex);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'show');
      assert.strictEqual(jqNewView.css('visibility'), 'visible');
    } finally {
      ViewLoader.prototype.loadView = oldLoadView;
      BrowserUrl.setLocationUrl = oldSetLocationUrl;
      ViewScopeManager.viewScopes = {};
      ViewManager.sequenceGenerator = new SequenceGenerator(100001);
      ViewLoader.lastViewInfo = {};
      ViewLoader.sequenceGenerator = new SequenceGenerator(100001);
    }
  });

  QUnit.test('startViewLifecycle', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'init');
    jqNewView.attr(Global.config.viewUrlAttributeName, 'url/100001');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.attr(Global.config.viewLoadedAttributeName, 'true');
    jqNewView.css('visibility', 'hidden');
    jqNewView.prependTo(jqTest);

    var newLocationUrl = null;
    var oldSetLocationUrl = BrowserUrl.setLocationUrl;

    try {
      var onViewLifecycleStartCalledFlag = false;
      var viewScope = {
        onViewLifecycleStart: function () {
          onViewLifecycleStartCalledFlag = true;
        }
      };

      populateViewScope(viewScope, jqNewView);
      ViewScopeManager.viewScopes['viewName1'] = viewScope;

      // 避免浏览器跳转
      BrowserUrl.setLocationUrl = function (newUrl) {
        newLocationUrl = newUrl;
      };

      // 调用方法
      ViewManager.startViewLifecycle(jqNewView[0]);

      assert.strictEqual(onViewLifecycleStartCalledFlag, true);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'show');
      assert.strictEqual(jqNewView.css('display'), 'block');
      // 检查跳转的 URL
      assert.strictEqual(newLocationUrl, '/#/url/100001');
    } finally {
      ViewScopeManager.viewScopes = {};
      BrowserUrl.setLocationUrl = oldSetLocationUrl;
    }
  });

  QUnit.test('stopViewLifecycle', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'show');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.attr(Global.config.viewLoadedAttributeName, 'true');
    jqNewView.css('visibility', 'visible');
    jqNewView.prependTo(jqTest);

    try {
      var onViewLifecycleStopCalledFlag = false;
      var viewScope = {
        onViewLifecycleStop: function () {
          onViewLifecycleStopCalledFlag = true;
        }
      };

      populateViewScope(viewScope, jqNewView);
      ViewScopeManager.viewScopes['viewName1'] = viewScope;

      assert.strictEqual(jqTest.find('.pure-view').length, 1);
      // 调用方法
      ViewManager.stopViewLifecycle(jqNewView[0]);

      assert.strictEqual(jqTest.find('.pure-view').length, 0);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'destroy');
      assert.strictEqual(onViewLifecycleStopCalledFlag, true);
    } finally {
      ViewScopeManager.viewScopes = {};
    }
  });

  QUnit.test('showView', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'hidden');
    jqNewView.attr(Global.config.viewUrlAttributeName, 'url/100001');
    jqNewView.attr(Global.config.viewLoadedAttributeName, 'true');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.css('visibility', 'hidden');
    jqNewView.prependTo(jqTest);

    var newLocationUrl = null;
    var oldSetLocationUrl = BrowserUrl.setLocationUrl;

    try {
      var onViewShowCalledFlag = false;
      var viewScope = {
        onViewShow: function () {
          onViewShowCalledFlag = true;
        }
      };

      populateViewScope(viewScope, jqNewView);
      ViewScopeManager.viewScopes['viewName1'] = viewScope;

      // 避免浏览器跳转
      BrowserUrl.setLocationUrl = function (newUrl) {
        newLocationUrl = newUrl;
      };

      // 调用方法
      ViewManager.showView(jqNewView[0]);

      assert.strictEqual(onViewShowCalledFlag, true);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'show');
      assert.strictEqual(jqNewView.css('display'), 'block');
      // 检查跳转的 URL
      assert.strictEqual(newLocationUrl, '/#/url/100001');
    } finally {
      ViewScopeManager.viewScopes = {};
      BrowserUrl.setLocationUrl = oldSetLocationUrl;
    }
  });

  QUnit.test('hiddenView', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'show');
    jqNewView.attr(Global.config.viewLoadedAttributeName, 'true');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.css('visibility', 'visible');
    jqNewView.prependTo(jqTest);

    try {
      var onViewHiddenCalledFlag = false;
      var viewScope = {
        onViewHidden: function () {
          onViewHiddenCalledFlag = true;
        }
      };

      populateViewScope(viewScope, jqNewView);
      ViewScopeManager.viewScopes['viewName1'] = viewScope;

      // 调用方法
      ViewManager.hiddenView(jqNewView[0]);

      assert.strictEqual(onViewHiddenCalledFlag, true);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'hidden');
      assert.strictEqual(jqNewView.css('display'), 'none');
    } finally {
      ViewScopeManager.viewScopes = {};
    }
  });

  /**
   * @param {*} viewScope 
   */
  function populateViewScope(viewScope, jqNewView) {
    var viewInfo = new ViewInfo();
    viewInfo.setFullUrl('/url/100001');
    viewInfo.setUrlPattern('/url/{id}');

    var view = new View(jqNewView[0], viewInfo, viewScope);
    viewScope.VIEW = view;
  }

});

