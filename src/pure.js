
import { Global } from './global';
import { Utils } from './utils';
import { SequenceGenerator } from './helper/sequence-generator';
import { UrlParser } from './helper/url-parser';
import { BrowserUrl } from './helper/browser-url';
import { BrowserTitle } from './helper/browser-title';
import { View } from './view/view';
import { ViewInfo } from './view/view-info';
import { ViewResponse } from './view/view-response';
import { ViewLoader } from './view/view-loader';
import { ViewManager } from './view/view-manager';
import { ViewMask } from './view/view-mask';
import { AjaxResult } from './ajax/ajax-result';
import { AjaxCallService } from './ajax/ajax-call-service';
import { Ajax } from './ajax/ajax';
import { App } from './app/app';
import { AppAlertMessages } from './app/app-alert-messages';


/* SOURCE-CODE-START */

/**
 * @namespace Pure
 */

var Pure = {
  utils: Utils,
  app: App,
  config: Global.config,
  messages: Global.messages,
  fn: {
    Global: Global,
    Utils: Utils,
    SequenceGenerator: SequenceGenerator,
    UrlParser: UrlParser,
    BrowserUrl: BrowserUrl,
    BrowserTitle: BrowserTitle,
    View: View,
    ViewInfo: ViewInfo,
    ViewResponse: ViewResponse,
    ViewLoader: ViewLoader,
    ViewManager: ViewManager,
    ViewMask: ViewMask,
    AjaxResult: AjaxResult,
    AjaxCallService: AjaxCallService,
    Ajax: Ajax,
    AppAlertMessages: AppAlertMessages,
    App: App
  }
};

/* SOURCE-CODE-END */

export { Pure };

