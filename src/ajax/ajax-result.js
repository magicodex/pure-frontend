
import { jQuery } from 'jquery';
import { Utils } from '../utils';
import { App } from '../app/app';

/* SOURCE-CODE-START */

/**
 * Ajax结果
 * @class
 * @param {jQuery.Deferred} deferred 
 * @param {(Document|Element)} [targetElement] 
 */
function AjaxResult(deferred, targetElement) {
  if (Utils.isNullOrUndefined(deferred)) {
    throw new Error('argument#0 "deferred" is null/undefined');
  }

  this._deferred = deferred;
  this._targetElement = targetElement;
}

/**
 * @description 处理调用结果
 * @param {function} doneFn 
 * @param {function} failFn 
 * @returns {jQuery.Deferred}
 */
AjaxResult.prototype.thenResult = function (doneFn, failFn) {
  return this.doHandleDeferred(doneFn, failFn, false);
};

/**
 * @description 处理调用结果
 * @param {function} doneFn 
 * @param {function} failFn 
 * @returns {jQuery.Deferred}
 */
AjaxResult.prototype.waitResult = function (doneFn, failFn) {
  return this.doHandleDeferred(doneFn, failFn, true);
};

/**
 * @description 处理调用结果
 * @param {function} doneFn 
 * @param {function} failFn 
 * @param {boolean} showMask 
 * @returns {jQuery.Deferred}
 */
AjaxResult.prototype.doHandleDeferred = function (doneFn, failFn, showMask) {
  if (!Utils.isFunction(doneFn)) {
    throw new Error('argument#1 "doneFn" required function');
  }

  if (Utils.isNullOrUndefined(failFn)) {
    // 默认的错误处理
    failFn = function (jqXHR, textStatus, errorThrown) {
      AjaxResult.handleAjaxError(this._targetElement, jqXHR, textStatus, errorThrown);
    };
  }

  var deferred = this._deferred;

  if (showMask && !Utils.isNullOrUndefined(this._targetElement)) {
    var viewMask = new ViewMask(this._targetElement);
    // 显示遮罩层
    viewMask.showMask();

    deferred.always(function () {
      // 在请求完成时隐藏遮罩层
      viewMask.hiddenMask();
    });
  }

  if (jQuery.ajaxSettings.async === false) {
    if (deferred.status === 200) {
      var data = (deferred.responseJSON || responseText);
      doneFn(data, 'success', deferred);
    } else {
      if (deferred.statusText === 'timeout') {
        failFn(deferred, 'timeout', 'timeout');
      } else {
        failFn(deferred, 'error', '');
      }
    }

    return deferred;
  } else {
    return deferred.then(doneFn, failFn);
  }
};

/**
 * @description 处理 AJAX 错误
 * @param {(Document|Element)} targetElement
 * @param {jQuery.jqXHR} jqXHR 
 * @param {string} textStatus 
 * @param {string} errorThrown 
 */
AjaxResult.handleAjaxError = function (targetElement, jqXHR, textStatus, errorThrown) {
  if (Utils.isNullOrUndefined(jqXHR)) {
    throw new Error('argument#0 "jqXHR" is null/undefined');
  }

  var message;

  if (!Utils.isNullOrUndefined(jqXHR.responseJSON)) {
    message = jqXHR.responseJSON.message;
  }

  App.showError(message || Global.message.unknownError);
};

/* SOURCE-CODE-END */

export { AjaxResult };

