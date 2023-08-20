
"use strict";

QUnit.module('BrowserUrl', function () {
  var BrowserUrl = Pure.fn.BrowserUrl;

  QUnit.test('getBrowserUrl', function (assert) {
    {
      var actual = BrowserUrl.getBrowserUrl('/test/1001');

      assert.deepEqual(actual, '/#/test/1001');
    }

    {
      var actual = BrowserUrl.getBrowserUrl('test/1001');

      assert.deepEqual(actual, '/#/test/1001');
    }
  });

  QUnit.test('getFullUrl', function (assert) {
    {
      var actual = BrowserUrl.getFullUrl('/test/1001');

      assert.deepEqual(actual, '/test/1001');
    }

    {
      var actual = BrowserUrl.getFullUrl('test/1001');

      assert.deepEqual(actual, '/test/1001');
    }
  });

});

