"use strict";

import { jQuery } from 'jquery';
import { Utils } from '../utils';

/* SOURCE-CODE-START */

/**
 * 视图遮罩层
 * @class
 * @param {(Document|Element)} viewElement 
 */
function ViewMask(viewElement) {
  if (Utils.isNullOrUndefined(viewElement)) {
    throw new Error('argument#0 "viewElement is null/undefined');
  }

  this._viewElement = viewElement;
}

/**
 * @description 显示遮罩层
 */
ViewMask.prototype.showMask = function () {
  var jqElement = jQuery(this._viewElement);

  jqElement.prepend('<div class="pure-view-mask"><div></div></div>')
};

/**
 * @description 隐藏遮罩层
 */
ViewMask.prototype.hiddenMask = function () {
  var jqElement = jQuery(this._viewElement);

  jqElement.find('.pure-view-mask').remove();
};

/* SOURCE-CODE-END */

export { ViewMask };
