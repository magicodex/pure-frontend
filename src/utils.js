
"use strict";

/* SOURCE-CODE-START */

/**
 * 工具类
 * @class
 */
function Utils() {
  //
}

/**
 * @description 判断给定参数的值是不是字符串类型
 * @param {*} [arg] 
 * @returns {boolean} 若给定参数的值是字符串则返回 true, 否则返回 false 
 */
Utils.isString = function (arg) {
  return (typeof arg === 'string');
};

/**
 * @description 判断给定参数的值是不是数字类型
 * @param {*} [arg] 
 * @returns {boolean} 若给定参数的值是数字则返回 true, 否则返回 false 
 */
Utils.isNumber = function (arg) {
  return (typeof arg === 'number');
};

/**
 * @param {*} [arg] 判断给定参数的值是不是对象(包括 null 值)
 * @returns {boolean} 若给定参数的值是对象则返回 true, 反则返回 false
 */
Utils.isObject = function (arg) {
  return (typeof arg === 'object');
};

/**
 * @description 判断给定参数的值是不是函数
 * @param {*} [arg] 
 * @returns {boolean} 若给定参数的值是函数则返回 true, 反则返回 false
 */
Utils.isFunction = function (arg) {
  return (typeof arg === 'function');
};

/**
 * @description 判断给定参数的值是不是 null/undefined
 * @param {*} [arg] 
 * @returns {boolean} 若给定参数的值是 null/undefined 则返回 true, 否则返回 false
 */
Utils.isNullOrUndefined = function (arg) {
  return (arg === null || arg === undefined);
};

/**
 * @description 判断给定参数的值是不是空字符
 * @param {*} [arg] 
 * @returns {boolean} 若给定参数的值不是空字符串则返回 true, 否则返回 false
 */
Utils.isNotEmptyString = function (arg) {
  return (Utils.isString(arg) && arg.length > 0);
};

/**
 * @description 判断给定参数的值是不是空对象
 * @param {*} [arg]
 * @returns {boolean} 若给定参数的值不是空对象则返回 true, 否则返回 false
 */
Utils.isNotEmptyObject = function (arg) {
  if (Utils.isNullOrUndefined(arg) || !Utils.isObject(arg)) {
    return false;
  }

  for (var key in arg) {
    return true;
  }

  return false;
};

/**
 * @description 若第一个参数不是 null/undefined 则返回第一个参数，否则返回空字符串
 * @param {*} [arg]
 * @returns {string}
 */
Utils.emptyStringIfNullOrUndefined = function (arg) {
  if (Utils.isNullOrUndefined(arg)) {
    return '';
  }

  return arg;
};

/**
 * @description 若第一个参数不是 null/undefined 则返回第一个参数，否则返回空数组
 * @param {*} [arg]
 * @returns {Array}
 */
Utils.emptyArrayIfNullOrUndefined = function (arg) {
  if (Utils.isNullOrUndefined(arg)) {
    return [];
  }

  return arg;
};

/**
 * @description 若第一个参数不是 null/undefined 则返回第一个参数，否则返回空对象
 * @param {*} [arg]
 * @returns {object}
 */
Utils.emptyObjectIfNullOrUndefined = function (arg) {
  if (Utils.isNullOrUndefined(arg)) {
    return {};
  }

  return arg;
};

/**
 * @description 转换给定参数的值成字符串
 * @param {*} [arg]
 * @returns {string} 若参数的值不是 null/undefined 则返回字符串，否则返回 null/undefined
 */
Utils.convertToString = function (arg) {
  if (typeof arg === 'string') {
    return arg;
  }

  if (Utils.isNullOrUndefined(arg)) {
    return arg;
  }

  return String(arg);
};

/**
 * @description 根据给定的字符串格式和参数做字符串格式化
 * @param {string} format 字符串格式的占位符是 {0}、{1}、{2} ...
 * @param {(string[]|...string)} args
 * @returns {string} 返回字符串格式化后的字符串
 */
Utils.formatString = function (format, objectArray) {
  if (Utils.isNullOrUndefined(format)) {
    throw new Error('argument#0 "format" is null/undefined');
  }

  if (!Utils.isString(format)) {
    throw new Error('argument#0 "format" required string');
  }

  if (!(objectArray instanceof Array)) {
    objectArray = [];

    for (var index = 1; index < arguments.length; index++) {
      objectArray.push(arguments[index]);
    }
  }

  // 替换占位符 {数字}
  var newString = format.replace(/\{([0-9]+)\}/g, function (match, index) {
    var argIndex = parseInt(index);
    var arg = objectArray[argIndex];

    return (Utils.convertToString(arg) || '');
  });

  return newString;
};

/**
 * @description 合并多个对象的字段到新的对象上
 * @param {(object[]|...object)} objectArray 
 * @returns {object}
 */
Utils.concatObjects = function (objectArray) {
  if (!(objectArray instanceof Array)) {
    objectArray = arguments;
  }

  var newObj = {};

  for (var index = 0; index < objectArray.length; index++) {
    var obj = objectArray[index];

    for (var key in obj) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
};

/* SOURCE-CODE-END */

export { Utils };
