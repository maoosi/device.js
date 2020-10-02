declare class DeviceJS {
    device: DeviceProps;
    private options;
    private resizeFunc;
    constructor(options?: DeviceJSUserOptions);
    init(): this;
    destroy(): this;
    private refreshProps;
    private detectUserAgent;
    private detectOrientation;
    private detectEvergreenBrowser;
    private detectWebP;
    private detectWebRTC;
    private detectWebGL;
    disableOverscroll(): this;
    enableOverscroll(): this;
    disableDoubleTapZoom(): this;
    enableDoubleTapZoom(): this;
    disableToolbarAutohide(): this;
    enableToolbarAutohide(): this;
}
interface DeviceProps {
    deviceOS: string | null;
    deviceType: string | null;
    deviceOrientation: string | null;
    browser: string | null;
    browserVersion: string | null;
    viewportHeight: number | null;
    viewportWidth: number | null;
    isKeyboardOpen: boolean | null;
    isBrowserEvergreen: boolean | null;
    isSupportedWebP: boolean | null;
    isSupportedWebGL: boolean | null;
    isSupportedWebRTC: boolean | null;
}
interface DeviceJSUserOptions {
    watch?: boolean;
}
declare global {
    interface Window {
        opera: any;
    }
}
declare const device: DeviceProps;
declare const disableOverscroll: () => DeviceJS;
declare const enableOverscroll: () => DeviceJS;
declare const disableDoubleTapZoom: () => DeviceJS;
declare const enableDoubleTapZoom: () => DeviceJS;
declare const disableToolbarAutohide: () => DeviceJS;
declare const enableToolbarAutohide: () => DeviceJS;
export { device, disableOverscroll, enableOverscroll, disableDoubleTapZoom, enableDoubleTapZoom, disableToolbarAutohide, enableToolbarAutohide, };
