
"use strict";

QUnit.module('SequenceGenerator', function () {
  var SequenceGenerator = Pure.fn.SequenceGenerator;

  QUnit.test('nextValue', function (assert) {
    {
      var sequenceGenerator = new SequenceGenerator();

      assert.strictEqual(sequenceGenerator.nextValue(), 1);
      assert.strictEqual(sequenceGenerator.nextValue(), 2);
    }

    {
      var sequenceGenerator = new SequenceGenerator(1001);

      assert.strictEqual(sequenceGenerator.nextValue(), 1001);
      assert.strictEqual(sequenceGenerator.nextValue(), 1002);
    }
  });

});

