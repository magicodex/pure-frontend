
"use strict";

QUnit.module('ViewManager', function () {
  var ViewManager = Pure.fn.ViewManager;
  var Global = Pure.fn.Global;
  var BrowserUrl = Pure.fn.BrowserUrl;
  var ViewLoader = Pure.fn.ViewLoader;
  var SequenceGenerator = Pure.fn.SequenceGenerator;

  QUnit.test('getViewScope', function (assert) {
    try {
      var actual1 = ViewManager.getViewScope('viewName1', false);
      assert.strictEqual(actual1, undefined);

      var actual2 = ViewManager.getViewScope('viewName1');
      assert.deepEqual(actual2, {});
    } finally {
      ViewManager.viewScopes = {};
    }
  });

  QUnit.test('setViewScope', function (assert) {
    try {
      assert.strictEqual(ViewManager.viewScopes['viewName1'], undefined);

      ViewManager.setViewScope('viewName1', { 'key1': 'value1' });
      assert.deepEqual(ViewManager.viewScopes['viewName1'], {
        'key1': 'value1'
      });
    } finally {
      ViewManager.viewScopes = {};
    }
  });

  QUnit.test('removeViewScope', function (assert) {
    try {
      ViewManager.viewScopes = {
        'viewName1': {
          'key1': 'value1'
        }
      };

      ViewManager.removeViewScope('viewName1');
      assert.deepEqual(ViewManager.viewScopes, {});
    } finally {
      ViewManager.viewScopes = {};
    }
  });

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
      ViewManager.viewScopes = {
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

      // 检查调整后的视图作用域的名称
      assert.deepEqual(ViewManager.viewScopes, {
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
      ViewManager.viewScopes = {};
      ViewManager.sequenceGenerator = new SequenceGenerator(100001);
      ViewLoader.lastViewInfo = {};
      ViewLoader.sequenceGenerator = new SequenceGenerator(100001);
    }
  });

  QUnit.test('startViewLifecycle', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'loading');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.css('visibility', 'hidden');
    jqNewView.prependTo(jqTest);

    try {
      var onViewLifecycleStartCalledFlag = false;
      ViewManager.viewScopes['viewName1'] = {
        onViewLifecycleStart: function () {
          onViewLifecycleStartCalledFlag = true;
        }
      };

      // 调用方法
      ViewManager.startViewLifecycle(jqNewView[0]);

      assert.strictEqual(onViewLifecycleStartCalledFlag, true);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'show');
      assert.strictEqual(jqNewView.css('visibility'), 'visible');
    } finally {
      ViewManager.viewScopes = {};
    }
  });

  QUnit.test('stopViewLifecycle', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'show');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.css('visibility', 'visible');
    jqNewView.prependTo(jqTest);

    try {
      var onViewLifecycleStopCalledFlag = false;
      ViewManager.viewScopes['viewName1'] = {
        onViewLifecycleStop: function () {
          onViewLifecycleStopCalledFlag = true;
        }
      };

      assert.strictEqual(jqTest.find('.pure-view').length, 1);
      // 调用方法
      ViewManager.stopViewLifecycle(jqNewView[0]);

      assert.strictEqual(jqTest.find('.pure-view').length, 0);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'destroy');
      assert.strictEqual(onViewLifecycleStopCalledFlag, true);
    } finally {
      ViewManager.viewScopes = {};
    }
  });
  
  QUnit.test('showView', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'hidden');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.css('visibility', 'hidden');
    jqNewView.prependTo(jqTest);

    try {
      var onViewShowCalledFlag = false;
      ViewManager.viewScopes['viewName1'] = {
        onViewShow: function () {
          onViewShowCalledFlag = true;
        }
      };

      // 调用方法
      ViewManager.showView(jqNewView[0]);

      assert.strictEqual(onViewShowCalledFlag, true);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'show');
      assert.strictEqual(jqNewView.css('visibility'), 'visible');
    } finally {
      ViewManager.viewScopes = {};
    }
  });

  QUnit.test('hiddenView', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'show');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.css('visibility', 'visible');
    jqNewView.prependTo(jqTest);

    try {
      var onViewHiddenCalledFlag = false;
      ViewManager.viewScopes['viewName1'] = {
        onViewHidden: function () {
          onViewHiddenCalledFlag = true;
        }
      };

      // 调用方法
      ViewManager.hiddenView(jqNewView[0]);

      assert.strictEqual(onViewHiddenCalledFlag, true);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'hidden');
      assert.strictEqual(jqNewView.css('visibility'), 'hidden');
    } finally {
      ViewManager.viewScopes = {};
    }
  });

});

