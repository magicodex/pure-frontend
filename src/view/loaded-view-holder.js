"use strict";

import jQuery from 'jquery';
import { Utils } from '../utils';
import { ViewScopeManager } from './view-scope-manager';
import { Global } from '../global';

/* SOURCE-CODE-START */

/**
 * @class
 * @param {(jQuery|Element)} view 
 */
function LoadedViewHolder(view) {
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
LoadedViewHolder.prototype.getViewObject = function () {
  var viewScope = this.getViewScope();
  if (Utils.isNullOrUndefined(viewScope)) {
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
LoadedViewHolder.prototype.getViewScope = function () {
  var viewIndex = this.getAttrValueFromTagElement(Global.config.viewIndexAttributeName);

  if (Utils.isNullOrUndefined(viewIndex)) {
    var idValue = this.getAttrValueFromTagElement('id');
    var errorFormat = 'not found the dom(id={0}) attribute "{1}"';
    var errorMessage = Utils.formatString(errorFormat, [idValue, Global.config.viewIndexAttributeName]);

    throw new Error(errorMessage);
  }

  var viewScope = ViewScopeManager.getViewScope(viewIndex, true);

  return viewScope;
};

/**
 * @description 设置视图成可见
 */
LoadedViewHolder.prototype.setViewToShow = function () {
  this._jqView.css('display', 'block');
};

/**
 * @description 设置视图成隐藏
 */
LoadedViewHolder.prototype.setViewToHide = function () {
  this._jqView.css('display', 'none');
};

/**
 * @description 获取视图作用域对象的指定属性
 * @param {string} propName 
 * @returns {*}
 */
LoadedViewHolder.prototype.getPropValueFromViewScope = function (propName) {
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
LoadedViewHolder.prototype.setPropValueToViewScope = function (propName, propValue) {
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
LoadedViewHolder.prototype.getAttrValueFromTagElement = function (attrName) {
  return this._jqView.attr(attrName);
};

/**
 * @description 设置标签元素的指定属性
 * @param {string} attrName 
 * @param {*} attrValue 
 */
LoadedViewHolder.prototype.setAttrValueToTagElement = function (attrName, attrValue) {
  this._jqView.attr(attrName, attrValue);
};

/* SOURCE-CODE-END */

export { LoadedViewHolder };
