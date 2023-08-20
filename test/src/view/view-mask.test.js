
"use strict";

QUnit.module('ViewMask', function () {
  var ViewMask = Pure.fn.ViewMask;

  QUnit.test('test', function (assert) {
    var jqTest = $('#qunit-fixture');
    var viewMask = new ViewMask(jqTest[0]);

    viewMask.showMask();
    assert.strictEqual(jqTest.find('div.pure-view-mask').length, 1);

    viewMask.hiddenMask();
    assert.strictEqual(jqTest.find('div.pure-view-mask').length, 0);
  });

});

