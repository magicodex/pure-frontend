
"use strict";

QUnit.module('ViewScopeManager', function () {
  var ViewScopeManager = Pure.fn.ViewScopeManager;

  QUnit.test('getViewScope', function (assert) {
    try {
      var actual1 = ViewScopeManager.getViewScope('viewName1', false);
      assert.strictEqual(actual1, undefined);

      var actual2 = ViewScopeManager.getViewScope('viewName1');
      assert.deepEqual(actual2, {});
    } finally {
      ViewScopeManager.viewScopes = {};
    }
  });

  QUnit.test('setViewScope', function (assert) {
    try {
      assert.strictEqual(ViewScopeManager.viewScopes['viewName1'], undefined);

      ViewScopeManager.setViewScope('viewName1', { 'key1': 'value1' });
      assert.deepEqual(ViewScopeManager.viewScopes['viewName1'], {
        'key1': 'value1'
      });
    } finally {
      ViewScopeManager.viewScopes = {};
    }
  });

  QUnit.test('removeViewScope', function (assert) {
    try {
      ViewScopeManager.viewScopes = {
        'viewName1': {
          'key1': 'value1'
        }
      };

      ViewScopeManager.removeViewScope('viewName1');
      assert.deepEqual(ViewScopeManager.viewScopes, {});
    } finally {
      ViewScopeManager.viewScopes = {};
    }
  });


});

