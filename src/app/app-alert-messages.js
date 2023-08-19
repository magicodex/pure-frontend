"use strict";

import jQuery from 'jquery';
import { Utils } from '../utils';


/* SOURCE-CODE-START */

/**
 * @class
 */
function AppAlertMessages() {
  //
}

/**
 * @description 显示信息
 * @param {string} message 
 */
AppAlertMessages.showMessage = function (message) {
  message = Utils.emptyStringIfNullOrUndefined(message);

  var format = '<div class="alert alert-success pure-app-alert" role="alert">{0}</div>';
  var html = Utils.formatString(format, [message]);
  var jqElement = jQuery(html).prependTo('body');

  jqElement.delay(1000).fadeOut('fast', function () {
    jqElement.remove();
  });
};

/**
 * @description 显示错误信息
 * @param {string} message 
 */
AppAlertMessages.showError = function (message) {
  message = Utils.emptyStringIfNullOrUndefined(message);

  var format = '<div class="alert alert-warning pure-app-alert" role="alert">{0}</div>';
  var html = Utils.formatString(format, [message]);
  var jqElement = jQuery(html).prependTo('body');

  jqElement.delay(2000).fadeOut('fast', function () {
    jqElement.remove();
  });
};


/* SOURCE-CODE-END */

export { AppAlertMessages };
