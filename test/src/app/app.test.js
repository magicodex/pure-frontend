
"use strict";

QUnit.module('App', function () {
  var App = Pure.fn.App;
  var ViewManager = Pure.fn.ViewManager;
  var ViewScopeManager = Pure.fn.ViewScopeManager;

  QUnit.test('test', function (assert) {
    try {
      App.viewScope('viewName1', function (scope) {
        scope.field1 = 'value1';
        scope.field2 = 'value2';
      });

      App.viewMain('viewName1', function (scope, view) {
        //
      });

      var viewScope = ViewScopeManager.viewScopes['viewName1'];
      assert.strictEqual(viewScope.field1, 'value1');
      assert.strictEqual(viewScope.field2, 'value2');
      assert.strictEqual((typeof viewScope.main), 'function');
    } finally {
      ViewScopeManager.viewScopes = {};
    }
  });

});

