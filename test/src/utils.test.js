
QUnit.module('Utils', function () {
  var Utils = Pure.fn.Utils;

  QUnit.test('isString', function (assert) {
    assert.strictEqual(Utils.isString('1'), true);
    assert.strictEqual(Utils.isString(''), true);

    assert.strictEqual(Utils.isString(1), false);
    assert.strictEqual(Utils.isString(true), false);

    assert.strictEqual(Utils.isString(null), false);
    assert.strictEqual(Utils.isString(undefined), false);
  });

  QUnit.test('isNumber', function (assert) {
    assert.strictEqual(Utils.isNumber('1'), false);
    assert.strictEqual(Utils.isNumber(''), false);

    assert.strictEqual(Utils.isNumber(1), true);
    assert.strictEqual(Utils.isNumber(true), false);

    assert.strictEqual(Utils.isNumber(null), false);
    assert.strictEqual(Utils.isNumber(undefined), false);
  });

  QUnit.test('isNullOrUndefined', function (assert) {
    assert.strictEqual(Utils.isNullOrUndefined('1'), false);
    assert.strictEqual(Utils.isNullOrUndefined(''), false);

    assert.strictEqual(Utils.isNullOrUndefined(1), false);
    assert.strictEqual(Utils.isNullOrUndefined(true), false);

    assert.strictEqual(Utils.isNullOrUndefined(null), true);
    assert.strictEqual(Utils.isNullOrUndefined(undefined), true);
  });

  QUnit.test('isNotEmptyString', function (assert) {
    assert.strictEqual(Utils.isNotEmptyString('1'), true);
    assert.strictEqual(Utils.isNotEmptyString(''), false);

    assert.strictEqual(Utils.isNotEmptyString(1), false);
    assert.strictEqual(Utils.isNotEmptyString(true), false);

    assert.strictEqual(Utils.isNotEmptyString(null), false);
    assert.strictEqual(Utils.isNotEmptyString(undefined), false);
  });

  QUnit.test('isNotEmptyObject', function (assert) {
    assert.strictEqual(Utils.isNotEmptyObject({ 'key': 'value' }), true);
    assert.strictEqual(Utils.isNotEmptyObject({}), false);

    assert.strictEqual(Utils.isNotEmptyObject('1'), false);
    assert.strictEqual(Utils.isNotEmptyObject(''), false);
    assert.strictEqual(Utils.isNotEmptyObject(1), false);
    assert.strictEqual(Utils.isNotEmptyObject(true), false);
    assert.strictEqual(Utils.isNotEmptyString(null), false);
    assert.strictEqual(Utils.isNotEmptyString(undefined), false);
  });

  QUnit.test('formatString', function (assert) {
    var actual = Utils.formatString('[{0}="{1}"]', 'data-show', 'false');

    assert.strictEqual(actual, '[data-show="false"]');
  });

  QUnit.test('concatObjects', function (assert) {
    var actual = Utils.concatObjects({ 'key1': 'value1' }, { 'key2': 'value2' });

    assert.deepEqual(actual, {
      'key1': 'value1',
      'key2': 'value2'
    });
  });

});
