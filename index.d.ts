/** Declaration file generated by dts-gen */

export const config: {
    appUrl: string;
    mainViewClassName: string;
    tagKeyAttributeName: string;
};

export const messages: {
    notFoundFullUrl: string;
    notFoundUrlPattern: string;
    notFoundviewName: string;
    unknownError: string;
};

export function app(): void;

export function utils(): void;

export namespace app {
    function loadView(url: any): void;

    function popView(url: any): void;

    function pushView(url: any): void;

    function showError(message: any): void;

    function showMessage(message: any): void;

    function viewMain(viewName: any, mainFn: any): void;

    function viewScope(viewName: any, callbackFn: any): void;

}

export namespace fn {
    class AjaxCallService {
        constructor(targetElement: any);

        beforeSend(jqXHR: any, settings: any): void;

        callService(url: any, data: any, opts: any): any;

    }

    class AjaxResult {
        constructor(deferred: any, targetElement: any);

        doHandleDeferred(deferred: any, doneFn: any, failFn: any, showMask: any): any;

        handleAjaxError(jqXHR: any, textStatus: any, errorThrown: any): void;

        thenResult(doneFn: any, failFn: any): any;

        waitResult(doneFn: any, failFn: any): any;

    }

    class SequenceGenerator {
        constructor(initValue: any, ...args: any[]);

        nextValue(): any;

    }

    class View {
        constructor(viewElement: any, viewInfo: any);

        $find(...args: any[]): any;

        $ui(name: any): any;

        callService(url: any, data: any, opts: any): any;

        getDataModel(): any;

        getUrlParam(name: any): any;

        getUrlParams(): any;

        getViewElement(): any;

        getViewInfo(): any;

    }

    class ViewInfo {
        constructor();

        getFullUrl(): any;

        getUrlPattern(): any;

        getViewName(): any;

        setFullUrl(fullUrl: any): void;

        setUrlPattern(urlPattern: any): void;

        setViewName(viewName: any): void;

    }

    class ViewMask {
        constructor(viewElement: any);

        hiddenMask(): void;

        showMask(): void;

    }

    class ViewResponse {
        constructor(url: any, jqXHR: any);

        getViewInfo(): any;

        static fullUrlHeaderName: string;

        static urlPatternHeaderName: string;

        static viewNameHeaderName: string;

    }

    function Ajax(): void;

    function App(): void;

    function AppAlertMessages(): void;

    function BrowserUrl(): void;

    function Global(): void;

    function UrlParser(): void;

    function Utils(): void;

    function ViewLoader(): void;

    function ViewManager(): void;

    namespace Ajax {
        function callService(url: any, data: any, opts: any): any;

    }

    namespace App {
        function loadView(url: any): void;

        function popView(url: any): void;

        function pushView(url: any): void;

        function showError(message: any): void;

        function showMessage(message: any): void;

        function viewMain(viewName: any, mainFn: any): void;

        function viewScope(viewName: any, callbackFn: any): void;

    }

    namespace AppAlertMessages {
        function showError(message: any): void;

        function showMessage(message: any): void;

    }

    namespace BrowserUrl {
        function getBrowserUrl(viewUrl: any): any;

        function getFullUrl(relativeUrl: any): any;

        function setBrowserUrl(viewUrl: any): void;

        function setLocationUrl(newUrl: any): void;

    }

    namespace Global {
        const config: {
            appUrl: string;
            mainViewClassName: string;
            tagKeyAttributeName: string;
        };

        const messages: {
            notFoundFullUrl: string;
            notFoundUrlPattern: string;
            notFoundviewName: string;
            unknownError: string;
        };

    }

    namespace UrlParser {
        function parseAllParams(fullUrl: any, urlPattern: any): any;

        function parsePathParams(fullUrl: any, urlPattern: any): any;

        function parseQueryParams(fullUrl: any): any;

    }

    namespace Utils {
        function concatObjects(objectArray: any, ...args: any[]): any;

        function convertToString(arg: any): any;

        function emptyArrayIfNullOrUndefined(arg: any): any;

        function emptyObjectIfNullOrUndefined(arg: any): any;

        function emptyStringIfNullOrUndefined(arg: any): any;

        function formatString(format: any, objectArray: any, ...args: any[]): any;

        function isFunction(arg: any): any;

        function isNotEmptyObject(arg: any): any;

        function isNotEmptyString(arg: any): any;

        function isNullOrUndefined(arg: any): any;

        function isNumber(arg: any): any;

        function isObject(arg: any): any;

        function isString(arg: any): any;

    }

    namespace ViewLoader {
        const lastView: {
        };

        function initViewAfterRender(jqView: any): void;

        function loadView(url: any): void;

        function preRenderView(url: any, data: any, textStatus: any, jqXHR: any): any;

        function renderView(url: any, data: any, textStatus: any, jqXHR: any): void;

        namespace sequenceGenerator {
            function nextValue(): any;

        }

    }

    namespace ViewManager {
        const viewScopes: {
        };

        function getViewScope(viewName: any): any;

        function loadView(url: any): void;

        function popView(url: any): void;

        function pushView(url: any): void;

    }

}

export namespace utils {
    function concatObjects(objectArray: any, ...args: any[]): any;

    function convertToString(arg: any): any;

    function emptyArrayIfNullOrUndefined(arg: any): any;

    function emptyObjectIfNullOrUndefined(arg: any): any;

    function emptyStringIfNullOrUndefined(arg: any): any;

    function formatString(format: any, objectArray: any, ...args: any[]): any;

    function isFunction(arg: any): any;

    function isNotEmptyObject(arg: any): any;

    function isNotEmptyString(arg: any): any;

    function isNullOrUndefined(arg: any): any;

    function isNumber(arg: any): any;

    function isObject(arg: any): any;

    function isString(arg: any): any;

}
