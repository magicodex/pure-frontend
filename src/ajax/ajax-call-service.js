
import { jQuery } from 'jquery';
import { Utils } from '../utils';
import { AjaxResult } from './ajax-result';

/* SOURCE-CODE-START */

/**
 * @class
 * @param {(Document|Element)} [sourceElement] 
 */
function AjaxCallService(sourceElement) {
  this._sourceElement = sourceElement;
}

/**
 * @description 调用远程接口
 * @param {string} url 
 * @param {*} [data] 
 * @param {PlainObject} [opts] 
 * @returns {AjaxResult}
 */
AjaxCallService.prototype.callService = function (url, data, opts) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  data = Utils.emptyObjectIfNullOrUndefined(data);
  opts = Utils.emptyObjectIfNullOrUndefined(opts);
  var dataStr = JSON.stringify(data);

  var initOpts = {
    url: url,
    type: 'POST',
    cache: false,
    contentType: 'application/json',
    dataType: 'json',
    data: dataStr,
    beforeSend: this.beforeSend,
    error: function (jqXHR, textStatus, errorThrown) {
      // 覆盖全局的错误处理
    }
  };

  var newOpts = Utils.concatObjects([initOpts, opts]);
  var deferred = jQuery.ajax(newOpts);
  var ajaxResult = new AjaxResult(deferred, this._sourceElement);

  return ajaxResult;
};

/**
 * @description 发送请求前调用
 * @param {jQuery.jqXHR} jqXHR 
 * @param {PlainObject} settings 
 */
AjaxCallService.prototype.beforeSend = function (jqXHR, settings) {
  //
};

/* SOURCE-CODE-END */

export { AjaxCallService };

