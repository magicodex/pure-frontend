
"use strict";

QUnit.module('ViewManager', function () {
  var ViewManager = Pure.fn.ViewManager;
  var Global = Pure.fn.Global;

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

  QUnit.test('initView', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'loading');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.css('visibility', 'hidden');
    jqNewView.prependTo(jqTest);

    try {
      var onViewCreateCalledFlag = false;
      ViewManager.viewScopes['viewName1'] = {
        onViewCreate: function () {
          onViewCreateCalledFlag = true;
        }
      };

      // 调用方法
      ViewManager.initView(jqNewView[0]);

      assert.strictEqual(onViewCreateCalledFlag, true);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'show');
      assert.strictEqual(jqNewView.css('visibility'), 'visible');
    } finally {
      ViewManager.viewScopes = {};
    }
  });

  QUnit.test('pauseView', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'show');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.css('visibility', 'visible');
    jqNewView.prependTo(jqTest);

    try {
      var onViewPauseCalledFlag = false;
      ViewManager.viewScopes['viewName1'] = {
        onViewPause: function () {
          onViewPauseCalledFlag = true;
        }
      };

      // 调用方法
      ViewManager.pauseView(jqNewView[0]);

      assert.strictEqual(onViewPauseCalledFlag, true);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'hidden');
      assert.strictEqual(jqNewView.css('visibility'), 'hidden');
    } finally {
      ViewManager.viewScopes = {};
    }
  });

  QUnit.test('resumeView', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'hidden');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.css('visibility', 'hidden');
    jqNewView.prependTo(jqTest);

    try {
      var onViewResumeCalledFlag = false;
      ViewManager.viewScopes['viewName1'] = {
        onViewResume: function () {
          onViewResumeCalledFlag = true;
        }
      };

      // 调用方法
      ViewManager.resumeView(jqNewView[0]);

      assert.strictEqual(onViewResumeCalledFlag, true);
      assert.strictEqual(jqNewView.attr(Global.config.viewStatusAttributeName), 'show');
      assert.strictEqual(jqNewView.css('visibility'), 'visible');
    } finally {
      ViewManager.viewScopes = {};
    }
  });

  QUnit.test('destroyView', function (assert) {
    var jqTest = $('#qunit-fixture');
    var jqNewView = jQuery('<main class="pure-view"></main>');
    jqNewView.attr(Global.config.viewIndexAttributeName, 'viewName1');
    jqNewView.attr(Global.config.viewStatusAttributeName, 'show');
    jqNewView.attr(Global.config.tabIndexAttributeName, ViewManager.currentTab.tabIndex);
    jqNewView.css('visibility', 'visible');
    jqNewView.prependTo(jqTest);

    try {
      var onViewDestroyCalledFlag = false;
      ViewManager.viewScopes['viewName1'] = {
        onViewDestroy: function () {
          onViewDestroyCalledFlag = true;
        }
      };

      assert.strictEqual(jqTest.find('.pure-view').length, 1);
      // 调用方法
      ViewManager.destroyView(jqNewView[0]);

      assert.strictEqual(jqTest.find('.pure-view').length, 0);
      assert.strictEqual(onViewDestroyCalledFlag, true);
    } finally {
      ViewManager.viewScopes = {};
    }
  });

});

