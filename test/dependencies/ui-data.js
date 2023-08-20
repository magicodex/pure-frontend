
"use strict";

/*!
 * ui-data v1.3.6 (https://github.com/magicodex/ui-data)
 * Licensed under MIT (https://github.com/magicodex/ui-data/blob/main/LICENSE)
 */

(function(global, namespace) {

if (global['$uiData'] != null) {
  return;
}



/**
 * @namespace utils
 */

var utils = {};

/**
 * @memberof utils
 * @description 判断给定参数是否 null/undefined
 * @param {*} arg 
 * @returns {boolean}
 */
utils.isNullOrUndefined = function (arg) {
  return (arg === null || arg === undefined);
};

/**
 * @memberof utils
 * @description 添加指定的前缀
 * @param {*} obj 
 * @param {string} prefix 
 * @returns {*}
 */
utils.prefix = function (obj, prefix) {
  if (typeof prefix !== 'string') {
    throw new Error('argument#1 "prefix" required string');
  }

  if (obj === null || (typeof obj !== 'object')) {
    return obj;
  }

  var newObj = {};
  var newKey;

  for (var key in obj) {
    newKey = prefix + key;
    newObj[newKey] = obj[key];
  }

  return newObj;
};

/**
 * @memberof utils
 * @description 移除指定的前缀
 * @param {*} obj 
 * @param {string} prefix 
 * @returns {*}
 */
utils.unprefix = function (obj, prefix) {
  if (typeof prefix !== 'string') {
    throw new Error('argument#1 "prefix" required string');
  }

  if (obj === null || (typeof obj !== 'object')) {
    return obj;
  }

  var newObj = {};
  var newKey;

  for (var key in obj) {
    if (key.indexOf(prefix) === 0) {
      newKey = key.substring(prefix.length);
    } else {
      newKey = key;
    }

    newObj[newKey] = obj[key];
  }

  return newObj;
};



/**
 * @namespace defaultDataHandler
 */

var defaultDataHandler = {};

/**
 * @memberof defaultDataHandler
 * @param {Element[]} elements DOM元素
 * @param {function} [skipFn] 判断是否跳过值
 * @returns {*}
 */
defaultDataHandler.getValue = function (elements, skipFn) {
  if (!(elements instanceof Array)) {
    throw new Error('argument#0 "elements required Array');
  }

  if (elements.length <= 0) {
    throw new Error('argument#0 "elements is empty');
  }

  var element = elements[0];
  var tagName = element.tagName.toLowerCase();
  var value;

  if (tagName === 'input') {
    // 输入域标签
    value = this.getInputElementValue(elements);
  } else if (tagName === 'textarea') {
    // 文本域标签
    value = element.value;
  } else if (tagName === 'select') {
    // 选择框标签
    value = this.getSelectElementValue(element);
  } else {
    value = element.innerHtml;
  }

  return value;
};

/**
 * @memberof defaultDataHandler
 * @param {Element[]} elements DOM元素
 * @param {*} value 值
 * @param {boolean} [notSkipSetIfValueAbsent=false] 是否跳过没有指定值的元素
 */
defaultDataHandler.setValue = function (elements, value, notSkipSetIfValueAbsent) {
  if (!(elements instanceof Array)) {
    throw new Error('argument#0 "elements required Array');
  }

  if (elements.length <= 0) {
    throw new Error('argument#0 "elements is empty');
  }

  var element = elements[0];
  var tagName = element.tagName.toLowerCase();

  if (utils.isNullOrUndefined(value)) {
    value = '';
  }

  if (tagName === 'input') {
    // 输入域标签
    this.setInputElementValue(elements, value);
  } else if (tagName === 'textarea') {
    // 文本域标签
    element.value = value;
  } else if (tagName === 'select') {
    // 选择框标签
    this.setSelectElementValue(element, value);
  } else {
    element.innerHtml = value;
  }
};

/**
 * @memberof defaultDataHandler
 * @description 获取输入域标签元素的值
 * @param {Element[]} elements DOM元素
 * @returns {*}
 */
defaultDataHandler.getInputElementValue = function (elements) {
  if (!(elements instanceof Array)) {
    throw new Error('argument#0 "elements required Array');
  }

  if (elements.length <= 0) {
    throw new Error('argument#0 "elements is empty');
  }

  var element = elements[0];
  var tagName = element.tagName.toLowerCase();
  var inputType = element.getAttribute('type');
  var value;

  if (tagName === 'input' && inputType === 'radio') {
    value = null;

    // 单选框
    for (var index = 0; index < elements.length; index++) {
      var currentElement = elements[index];

      if (currentElement.checked) {
        value = currentElement.value;
        break;
      }
    }
  } else if (tagName === 'input' && inputType === 'checkbox') {
    value = [];

    // 复选框
    for (var index = 0; index < elements.length; index++) {
      var currentElement = elements[index];

      if (currentElement.checked) {
        value.push(currentElement.value);
      }
    }
  } else {
    value = element.value;
  }

  return value;
};

/**
 * @memberof defaultDataHandler
 * @description 设置输入域标签元素的值
 * @param {Element[]} elements DOM元素
 * @param {*} 值
 */
defaultDataHandler.setInputElementValue = function (elements, value) {
  if (!(elements instanceof Array)) {
    throw new Error('argument#0 "elements required Array');
  }

  if (elements.length <= 0) {
    throw new Error('argument#0 "elements is empty');
  }

  var element = elements[0];
  var tagName = element.tagName.toLowerCase();
  var inputType = element.getAttribute('type');

  if (tagName === 'input' && inputType === 'radio') {
    // 单选框
    for (var index = 0; index < elements.length; index++) {
      var currentElement = elements[index];
      currentElement.checked = (currentElement.value == value);
    }
  } else if (tagName === 'input' && inputType === 'checkbox') {
    // 复选框
    var valueArray = (value instanceof Array)
      ? value : [value];

    for (var index = 0; index < elements.length; index++) {
      var currentElement = elements[index];
      currentElement.checked = valueArray.includes(currentElement.value);
    }
  } else {
    element.value = value;
  }
};

/**
 * @memberof defaultDataHandler
 * @description 获取选择框标签元素的值
 * @param {Element[]} elements DOM元素
 * @returns {*}
 */
defaultDataHandler.getSelectElementValue = function (element) {
  if (utils.isNullOrUndefined(element)) {
    throw new Error('argument#0 "element is null/undefined');
  }

  // 单选下拉框
  if (!element.multiple) {
    var selectedIndex = element.selectedIndex;

    return (selectedIndex !== -1)
      ? element.item(selectedIndex).value
      : null;
  }

  // 多选下拉框
  var selectedValues = [];

  for (var index = 0; index < element.length; index++) {
    var option = element.item(index);

    if (option.selected) {
      selectedValues.push(option.value);
    }
  }

  return selectedValues;
};

/**
 * @memberof defaultDataHandler
 * @description 设置输入域标签元素的值
 * @param {Element[]} elements DOM元素
 * @param {*} 值
 */
defaultDataHandler.setSelectElementValue = function (element, value) {
  if (utils.isNullOrUndefined(element)) {
    throw new Error('argument#0 "element is null/undefined');
  }

  // 单选下拉框
  if (!element.multiple) {
    element.value = value;
    return;
  }

  // 多选下拉框
  for (var index = 0; index < element.length; index++) {
    var option = element.item(index);
    var selected = false;

    if (value instanceof Array) {
      selected = value.includes(option.value);
    }

    option.selected = selected;
  }
};



/**
 * @namespace checkboxBooleanHandler
 */

var checkboxBooleanHandler = {};

/**
 * @memberof checkboxBooleanHandler
 * @param {Element[]} elements DOM元素
 * @param {function} [skipFn] 判断是否跳过值
 * @returns {*}
 */
checkboxBooleanHandler.getValue = function (elements, skipFn) {
  var element = elements[0];

  return element.checked;
};

/**
 * @memberof checkboxBooleanHandler
 * @param {Element[]} elements DOM元素
 * @param {*} value 值
 * @@param {boolean} [notSkipSetIfValueAbsent=false] 是否跳过没有指定值的元素
 */
checkboxBooleanHandler.setValue = function (elements, value, notSkipSetIfValueAbsent) {
  var element = elements[0];

  element.checked = value;
};



/**
 * @class
 * @param {(Document|Element)} baseElement
 * @param {object} [opts]
 */
function Model(baseElement, opts) {
  opts = (opts || {});
  var config = Model.config;

  this._baseElement = baseElement;
  this._dataHandlers = (opts.dataHandlers || {});
  this._nameAttributeName = (opts.nameAttributeName || config.defaultNameAttributeName);
  this._typeAttributeName = (opts.typeAttributeName || config.defaultTypeAttributeName);

  this._initDataHandlers = config.initDataHandlers;
}

Model.config = {
  defaultNameAttributeName: 'data-name',
  defaultTypeAttributeName: 'data-type',
  initDataHandlers: {
    'default': defaultDataHandler,
    'checkbox-boolean': checkboxBooleanHandler
  }
};

/**
 * @description 获取对应的元素
 * @returns {(Document|Element)}
 */
Model.prototype.getBaseElement = function () {
  return this._baseElement;
};

/**
 * @description 获取指定表达式对应元素的数据
 * @param {(string|string[])} expression 表达式
 * @param {function} [skipFn] 判断是否跳过值,比如 (targetValue) => (targetValue == null)
 * @returns {*} 值
 */
Model.prototype.getData = function (expression, skipFn) {
  // 表达式只能是字符串或数组
  if ((typeof expression !== 'string') && !(expression instanceof Array)) {
    throw new Error('argument#0 "expression" required string or Array');
  }

  // 转换表达式成选择器
  var selector = this.convertExpressionToSelector(expression);
  // 查找指定选择器对应的元素
  var elements = this.queryElementsBySelector(selector);
  // 转换成数据名称和元素的映射
  var elementArrays = this.groupElementsByName(elements);

  // 若表达式是数组或者"*"结尾的字符串，则是获取多个元素的值
  if ((expression instanceof Array)
    || (expression.charAt(expression.length - 1) === '*')) {
    var elementValues = {};

    for (var dataName in elementArrays) {
      if (dataName === '') {
        continue;
      }

      var elementArray = elementArrays[dataName];
      // 获取元素的值
      var dataValue = this.doGetDataValue(elementArray, skipFn);

      if (utils.isNullOrUndefined(skipFn) || !skipFn(dataValue)) {
        elementValues[dataName] = dataValue;
      }
    }

    return elementValues;
  } else {
    if (elements.length <= 0) {
      return null;
    }

    for (var dataName in elementArrays) {
      if (dataName === '') {
        continue;
      }

      var elementArray = elementArrays[dataName];
      // 获取元素的值
      return this.doGetDataValue(elementArray, skipFn);
    }
  }
};

/**
 * @description 设置指定表达式对应元素的数据
 * @param {string|string[]} expression 表达式
 * @param {*} value 值
 * @param {boolean} [notSkipSetIfValueAbsent=false] 是否跳过没有指定值的元素,默认 false 跳过没有指定值的元素
 */
Model.prototype.setData = function (expression, value, notSkipSetIfValueAbsent) {
  // 表达式只能是字符串或数组
  if ((typeof expression !== 'string') && !(expression instanceof Array)) {
    throw new Error('argument#0 "expression" required string or Array');
  }

  notSkipSetIfValueAbsent = (notSkipSetIfValueAbsent === true);
  // 转换表达式成选择器
  var selector = this.convertExpressionToSelector(expression);
  // 查找指定选择器对应的元素
  var elements = this.queryElementsBySelector(selector);
  // 转换成数据名称和元素的映射
  var elementArrays = this.groupElementsByName(elements);

  // 若表达式是数组或者"*"结尾的字符串，则是设置多个元素的值
  if ((expression instanceof Array)
    || (expression.charAt(expression.length - 1) === '*')) {
    value = (value || {});

    for (var dataName in elementArrays) {
      var elementArray = elementArrays[dataName];
      var dataValue = value[dataName];

      if ((dataName in value) || notSkipSetIfValueAbsent) {
        // 设置元素的值
        this.doSetDataValue(elementArray, dataValue, notSkipSetIfValueAbsent);
      }
    }
  } else {
    if (elements.length <= 0) {
      return;
    }

    for (var dataName in elementArrays) {
      var elementArray = elementArrays[dataName];

      // 设置元素的值
      this.doSetDataValue(elementArray, value, notSkipSetIfValueAbsent);
    }
  }
};

/**
 * @description 获取元素的值
 * @param {Element[]} elements DOM元素
 * @param {function} [skipFn] 判断是否跳过值
 * @returns {*} 值
 */
Model.prototype.doGetDataValue = function (elements, skipFn) {
  if (!(elements instanceof Array)) {
    throw new Error('argument#0 "elements required Array');
  }

  if (elements.length <= 0) {
    throw new Error('argument#0 "elements is empty');
  }

  // 获取组件处理器
  var handler = this.getDataHandlerByElement(elements[0]);
  // 获取元素的值
  return handler.getValue(elements, skipFn);
};

/**
 * @description 设置元素的值
 * @param {Element[]} elements DOM元素
 * @param {*} value 值
 * @param {boolean} [notSkipSetIfValueAbsent] 是否默认 null 值
 */
Model.prototype.doSetDataValue = function (elements, value, notSkipSetIfValueAbsent) {
  if (!(elements instanceof Array)) {
    throw new Error('argument#0 "elements required Array');
  }

  if (elements.length <= 0) {
    throw new Error('argument#0 "elements is empty');
  }

  // 获取组件处理器
  var handler = this.getDataHandlerByElement(elements[0]);
  // 设置元素的值
  handler.setValue(elements, value, (notSkipSetIfValueAbsent === true));
};

/**
 * @description 获取组件处理器
 * @param {Element} element DOM元素 
 * @returns {Object} 组件处理器
 */
Model.prototype.getDataHandlerByElement = function (element) {
  if (utils.isNullOrUndefined(element)) {
    throw new Error('argument#0 "element is null/undefined');
  }

  var handler;
  var handlerName = element.getAttribute(this._typeAttributeName);

  // 先获取自定义的组件处理器
  if (!utils.isNullOrUndefined(handlerName)) {
    handler = (this._dataHandlers[handlerName]
      || this._initDataHandlers[handlerName]);

    if (utils.isNullOrUndefined(handler)) {
      throw new Error('not found handler "' + handlerName + '"');
    }

    return handler;
  }

  // 如果没有自定义的处理器，则获取标签对应的处理器
  var tagName = element.tagName.toLowerCase();
  handlerName = '@' + tagName;
  handler = (this._dataHandlers[handlerName]
    || this._initDataHandlers[handlerName]);

  // 如果没有找到自定义的处理器和标签对应的处理器，则取默认处理器
  if (utils.isNullOrUndefined(handler)) {
    handler = (this._dataHandlers['default']
      || this._initDataHandlers['default']);
  }

  return handler;
};

/**
 * @description 查找指定选择器对应的元素
 * @param {(string|string[])} selector 选择器
 * @returns {(Element[])} DOM元素
 */
Model.prototype.queryElementsBySelector = function (selector) {
  // 表达式只能是字符串或数组
  if ((typeof selector !== 'string') && !(selector instanceof Array)) {
    throw new Error('argument#0 "selector" required string or Array');
  }

  var selectorStr;

  if (selector instanceof Array) {
    selectorStr = selector.join(',');
  } else {
    selectorStr = selector;
  }

  return this._baseElement.querySelectorAll(selectorStr);
};

/**
 * @description 转换表达式成选择器
 * @param {(string|string[])} expression 表达式
 * @returns {string[]} 选择器数组
 */
Model.prototype.convertExpressionToSelector = function (expression) {
  // 表达式只能是字符串或数组
  if ((typeof expression !== 'string') && !(expression instanceof Array)) {
    throw new Error('argument#0 "expression" required string or Array');
  }

  var selectorArray = [];
  var expressionArray;

  if (expression instanceof Array) {
    expressionArray = expression;
  } else {
    expressionArray = [expression];
  }

  for (var index = 0; index < expressionArray.length; index++) {
    var expressionStr = expressionArray[index];

    if (expressionStr !== '') {
      var selectorStr;

      if (expressionStr === '*') {
        // 表达式是"*"的情况，则匹配所有的元素
        selectorStr = '[' + this._nameAttributeName + ']';
      } else if (expressionStr.charAt(expressionStr.length - 1) === '*') {
        // 表达式是"*"结尾的情况，则匹配指定前缀数据名称的元素
        var prefixStr = expressionStr.slice(0, -1);
        selectorStr = '[' + this._nameAttributeName + '^="' + prefixStr + '"]';
      } else {
        // 匹配指定数据名称的元素
        selectorStr = '[' + this._nameAttributeName + '="' + expressionStr + '"]';
      }

      selectorArray.push(selectorStr);
    }
  }

  return selectorArray;
};

/**
 * @description 转换成数据名称和元素的映射
 * @param {Object} elements DOM元素
 * @returns {Object} 结果
 */
Model.prototype.groupElementsByName = function (elements) {
  if (utils.isNullOrUndefined(elements)) {
    throw new Error('argument#0 "elements is null/undefined');
  }

  var elementArrays = {};

  for (var index = 0; index < elements.length; index++) {
    var element = elements[index];
    var dataName = element.getAttribute(this._nameAttributeName);
    dataName = (dataName || '');
    var elementArray = elementArrays[dataName];

    if (utils.isNullOrUndefined(elementArray)) {
      elementArray = [];
      elementArrays[dataName] = elementArray;
    }

    elementArray.push(element);
  }

  return elementArrays;
};




var uiData = {
  Model: Model,
  utils: utils,
  dataHandlers: {
    checkboxBooleanHandler: checkboxBooleanHandler,
    defaultDataHandler: defaultDataHandler
  },
  model: function (baseElement, opts) {
    return new Model(baseElement, opts);
  }
};



global[namespace] = uiData;
global['$uiData'] = uiData;
})(window, 'uiData');
