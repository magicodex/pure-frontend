
import { Utils } from '../utils';
import { AjaxResult } from './ajax-result';
import { AjaxCallService } from './ajax-call-service';

/* SOURCE-CODE-START */

/**
 * @class
 */
function Ajax() {
  //
}

/**
 * @description 调用远程接口
 * @param {string} url 
 * @param {*} [data] 
 * @param {PlainObject} [opts] 
 * @returns {AjaxResult}
 */
Ajax.callService = function (url, data, opts) {
  if (!Utils.isString(url)) {
    throw new Error('argument#0 "url" required string');
  }

  var ajaxCallService = new AjaxCallService();

  return ajaxCallService.callService(url, data, opts);
};

/* SOURCE-CODE-END */

export { Ajax };

