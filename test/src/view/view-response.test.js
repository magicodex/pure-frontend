
"use strict";

QUnit.module('ViewResponse', function () {
  var ViewResponse = Pure.fn.ViewResponse;

  QUnit.test('getViewInfo', function (assert) {
    var responseHeaders = {
      'x-page-code': 'viewName1',
      'x-page-url': '/url/100001',
      'x-url-pattern': '/url/{id}'
    };

    var viewResponse = new ViewResponse('/url/100001', {
      getResponseHeader: function (headerName) {
        return responseHeaders[headerName];
      }
    });

    var viewInfo = viewResponse.getViewInfo();
    assert.strictEqual(viewInfo.getViewName(), 'viewName1');
    assert.strictEqual(viewInfo.getFullUrl(), '/url/100001');
    assert.strictEqual(viewInfo.getUrlPattern(), '/url/{id}');
  });

});

