"use strict";

/* SOURCE-CODE-START */

/**
 * 序列生成器
 * @class
 * @param {number} [initValue] 
 */
function SequenceGenerator(initValue) {
  if (arguments.length > 0) {
    this._value = initValue;
  } else {
    this._value = 1;
  }
}

/**
 * @description 返回下一个值
 * @returns {number}
 */
SequenceGenerator.prototype.nextValue = function () {
  var nextValue = this._value;
  this._value++;

  return nextValue;
};

/* SOURCE-CODE-END */

export { SequenceGenerator };
