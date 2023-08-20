
"use strict";

QUnit.module('UrlParser', function () {
  var UrlParser = Pure.fn.UrlParser;

  QUnit.test('parseAllParams', function (assert) {
    var actual = UrlParser.parseAllParams(
      '/api/examples/type1?keyword=100001', '/api/examples/{type}');

    assert.deepEqual(actual, {
      type: 'type1',
      keyword: '100001'
    });
  });

  QUnit.test('parsePathParams', function (assert) {
    var actual = UrlParser.parsePathParams(
      '/api/examples/type1?keyword=100001', '/api/examples/{type}');

    assert.deepEqual(actual, {
      type: 'type1'
    });
  });

  QUnit.test('parseQueryParams', function (assert) {
    var actual = UrlParser.parseQueryParams('/api/examples/type1?keyword=100001');

    assert.deepEqual(actual, {
      keyword: '100001'
    });
  });

});

