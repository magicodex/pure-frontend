"use strict";

import jQuery from 'jquery';
import { Utils } from '../utils';
import { ViewScopeManager } from './view-scope-manager';
import { Global } from '../global';

/* SOURCE-CODE-START */

/**
 * @class
 * @param {*} loadedView 
 */
function LoadedViewHolder(loadedView) {
  if (Utils.isNullOrUndefined(loadedView)) {
    throw new Error('argument#0 "loadedView" is null/undefined');
  }

  var jQueryObject = LoadedViewHolder.getAndCheckJQueryObject(loadedView);
  var viewScope = LoadedViewHolder.getAndCheckViewScope(jQueryObject);
  var viewObject = LoadedViewHolder.getAndCheckViewObject(viewScope);

  this._jQueryObject = jQueryObject;
  this._viewScope = viewScope;
  this._viewObject = viewObject;
}

/**
 * @description 获取对应的视图对象
 * @returns {View}
 */
LoadedViewHolder.prototype.getViewObject = function () {
  return this._viewObject;
};

/**
 * @description 获取视图作用域对象
 * @returns {PlainObject}
 */
LoadedViewHolder.prototype.getViewScope = function () {
  return this._viewScope;
};

/**
 * @description 设置视图成可见
 */
LoadedViewHolder.prototype.setViewToShow = function () {
  this._jQueryObject.css('display', 'block');
};

/**
 * @description 设置视图成隐藏
 */
LoadedViewHolder.prototype.setViewToHide = function () {
  this._jQueryObject.css('display', 'none');
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
  viewScope[propName] = propValue;
};

/**
 * @description 获取标签元素的指定属性
 * @param {string} attrName 
 */
LoadedViewHolder.prototype.getAttrValueFromTagElement = function (attrName) {
  if (!Utils.isString(attrName)) {
    throw new Error('argument#0 "attrName" required string');
  }

  var attrValue = this._jQueryObject.attr(attrName);

  return attrValue;
};

/**
 * @description 设置标签元素的指定属性
 * @param {string} attrName 
 * @param {*} attrValue 
 */
LoadedViewHolder.prototype.setAttrValueToTagElement = function (attrName, attrValue) {
  if (!Utils.isString(attrName)) {
    throw new Error('argument#0 "attrName" required string');
  }

  this._jQueryObject.attr(attrName, attrValue);
};

/**
 * @param {*} loadedView 
 * @returns {jQueryObject}
 */
LoadedViewHolder.getAndCheckJQueryObject = function (loadedView) {
  if (Utils.isNullOrUndefined(loadedView)) {
    throw new Error('argument#0 "loadedView" is null/undefined');
  }

  var jQueryObject = (loadedView instanceof jQuery)
    ? loadedView : jQuery(loadedView);

  if (jQueryObject.length <= 0) {
    throw new Error('the jQuery object length is zero');
  }

  // 获取视图加载结果
  var viewLoaded = jQueryObject.attr(Global.config.viewLoadedAttributeName);

  if (!(Global.constants.VIEW_LOADED_TRUE === viewLoaded)) {
    throw new Error('the view is not load completed')
  }

  return jQueryObject;
};

/**
 * @param {*} jQueryObject 
 * @returns {PlainObject}
 */
LoadedViewHolder.getAndCheckViewScope = function (jQueryObject) {
  if (Utils.isNullOrUndefined(jQueryObject)) {
    throw new Error('argument#0 "viewElement" is null/undefined');
  }

  // 获取视图索引
  var viewIndex = jQueryObject.attr(Global.config.viewIndexAttributeName);

  if (Utils.isNullOrUndefined(viewIndex)) {
    var errorMessage = Utils.formatString('the dom attribute "{0}" is null/undefined',
      Global.config.viewIndexAttributeName);

    throw new Error(errorMessage);
  }

  var viewScope = ViewScopeManager.getViewScope(viewIndex, true);

  return viewScope;
};

/**
 * @param {*} viewScope 
 * @returns {View}
 */
LoadedViewHolder.getAndCheckViewObject = function (viewScope) {
  if (Utils.isNullOrUndefined(viewScope)) {
    throw new Error('argument#0 "viewScope" is null/undefined');
  }

  // 获取视图对象
  var viewObject = viewScope.VIEW;

  if (Utils.isNullOrUndefined(viewObject)) {
    throw new Error('the viewScope property "VIEW" is null/undefined');
  }

  return viewObject;
};


/* SOURCE-CODE-END */

export { LoadedViewHolder };
