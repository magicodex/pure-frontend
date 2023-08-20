
"use strict";

QUnit.module('SequenceGenerator', function () {
  var ViewInfo = Pure.fn.ViewInfo;

  QUnit.test('test', function (assert) {
    var viewInfo = new ViewInfo();

    viewInfo.setViewName('viewName1');
    viewInfo.setFullUrl('/url/100001');
    viewInfo.setUrlPattern('/url/{id}');

    assert.strictEqual(viewInfo.getViewName(), 'viewName1');
    assert.strictEqual(viewInfo.getFullUrl(), '/url/100001');
    assert.strictEqual(viewInfo.getUrlPattern(), '/url/{id}');
  });

});

