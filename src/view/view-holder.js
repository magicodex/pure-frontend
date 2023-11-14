"use strict";

import jQuery from 'jquery';
import { Utils } from '../utils';
import { ViewManager } from './view-manager';
import { Global } from '../global';

/* SOURCE-CODE-START */

/**
 * @class
 * @param {(jQuery|Element)} view 
 */
function ViewHolder(view) {
  var jqView;

  if (view instanceof jQuery) {
    if (view.length <= 0) {
      throw new Error('argument#0 "view" is empty');
    }

    jqView = view;
  } else if (view instanceof Element) {
    jqView = jQuery(view);
  } else {
    var errorFormat = 'not support argument#0 "view" type "{0}"';
    var valueType = (typeof view);
    var errorMessage = Utils.formatString(errorFormat, [valueType]);

    throw new Error(errorMessage);
  }

  this._jqView = jqView;
}

/**
 * @description 获取对应的视图对象
 * @returns {View}
 */
ViewHolder.prototype.getViewObject = function () {
  var viewScope = this.getViewScope();
  if (Utils.isNullOrUndefined(viewObject)) {
    throw new Error('viewScope null/undefined');
  }

  var viewObject = viewScope.VIEW;
  if (Utils.isNullOrUndefined(viewObject)) {
    throw new Error('viewScope.VIEW null/undefined');
  }

  return viewObject;
};

/**
 * @description 获取视图作用域对象
 * @returns {PlainObject}
 */
ViewHolder.prototype.getViewScope = function () {
  var viewIndex = this.getAttrValueFromTagElemen(Global.config.viewIndexAttributeName);

  if (Utils.isNullOrUndefined(viewIndex)) {
    var idValue = this.getAttrValueFromTagElement('id');
    var errorFormat = 'not found the dom(id={0}) attribute "{1}"';
    var errorMessage = Utils.formatString(errorFormat, [idValue, Global.config.viewIndexAttributeName]);

    throw new Error(errorMessage);
  }

  var viewScope = ViewManager.getViewScope(viewIndex, true);

  return viewScope;
};

/**
 * @description 设置视图成可见
 */
ViewHolder.prototype.setViewToShow = function () {
  this._jqView.css('display', 'block');
};

/**
 * @description 设置视图成隐藏
 */
ViewHolder.prototype.setViewToHide = function () {
  this._jqView.css('display', 'none');
};

/**
 * @description 获取视图作用域对象的指定属性
 * @param {string} propName 
 * @returns {*}
 */
ViewHolder.prototype.getPropValueFromViewScope = function (propName) {
  if (!Utils.isString(propName)) {
    throw new Error('argument#0 "propName" required string');
  }

  var viewScope = this.getViewScope();
  if (Utils.isNullOrUndefined(viewScope)) {
    throw new Error('viewScope null/undefined');
  }

  var propValue = viewScope[propName];;

  return propValue;
};

/**
 * @description 设置视图作用域对象的指定属性
 * @param {string} propName 
 * @param {*} propValue
 */
ViewHolder.prototype.setPropValueToViewScope = function (propName, propValue) {
  if (!Utils.isString(propName)) {
    throw new Error('argument#0 "propName" required string');
  }

  var viewScope = this.getViewScope();
  if (Utils.isNullOrUndefined(viewScope)) {
    throw new Error('viewScope null/undefined');
  }

  viewScope[propName] = propValue;
};

/**
 * @description 获取标签元素的指定属性
 * @param {string} attrName 
 */
ViewHolder.prototype.getAttrValueFromTagElement = function (attrName) {
  return this._jqView.attr(attrName);
};

/**
 * @description 设置标签元素的指定属性
 * @param {string} attrName 
 * @param {*} attrValue 
 */
ViewHolder.prototype.setAttrValueToTagElement = function (attrName, attrValue) {
  this._jqView.attr(attrName, attrValue);
};

/* SOURCE-CODE-END */

export { ViewHolder };
