interface DeviceProps {
    deviceOS: string | null;
    deviceType: string | null;
    deviceOrientation: string | null;
    browser: string | null;
    browserVersion: string | null;
    viewportHeight: number | null;
    viewportWidth: number | null;
    isBrowserEvergreen: boolean | null;
    isPWA: boolean | null;
    isSupportedWebP: boolean | null;
    isSupportedWebGL: boolean | null;
    isSupportedWebRTC: boolean | null;
}
declare global {
    interface Window {
        opera: any;
    }
    interface Navigator {
        standalone: any;
    }
}
export declare const device: DeviceProps;
export {};
