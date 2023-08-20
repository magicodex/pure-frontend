
"use strict";

QUnit.module('View', function () {
  var View = Pure.fn.View;
  var ViewInfo = Pure.fn.ViewInfo;

  QUnit.test('test', function (assert) {
    var jqTest = $('#qunit-fixture');
    jqTest.append('<input data-pure-ui-name="uiName1" data-name="name1" type="text" value="value1"/>');
    jqTest.append('<input data-pure-ui-name="uiName2" data-name="name2" type="text" value="value2"/>');

    var viewInfo = new ViewInfo();
    viewInfo.setViewName('viewName1');
    viewInfo.setFullUrl('/url/100001');
    viewInfo.setUrlPattern('/url/{id}');

    var view = new View(jqTest[0], viewInfo);
    var model = view.getDataModel();

    assert.deepEqual(model.getData('*'), {
      name1: 'value1',
      name2: 'value2'
    });

    // getUrlParams
    assert.deepEqual(view.getUrlParams(), {
      id: '100001'
    });

    // getUrlParam
    assert.strictEqual(view.getUrlParam('id'), '100001');

    // $ui
    var jqInput = view.$ui('uiName1');
    assert.strictEqual(jqInput.val(), 'value1');
  });

});

