import { reactive, readonly, effect } from '@vue/reactivity'
import throttle from 'lodash-es/throttle'

const uaConfig = require('./ua.json')

class DeviceJS {
    public device: DeviceProps
    private reactiveDevice: DeviceProps
    private resizeFunc: any

    constructor() {
        this.reactiveDevice = reactive({
            // device info
            deviceOS: null,
            deviceType: null,
            deviceOrientation: null,
        
            // browser info
            browser: null,
            browserVersion: null,
        
            // viewport info
            viewportHeight: null,
            viewportWidth: null,
        
            // utility states
            isBrowserEvergreen: null,
            isPWA: null,
        
            // browser features
            isSupportedWebP: null,
            isSupportedWebGL: null,
            isSupportedWebRTC: null,
        })

        this.resizeFunc = throttle(() => this.refreshProps(), 200)

        this.device = readonly(this.reactiveDevice)

        return this.init()
    }

    public init() {
        if (window) {
            this.refreshProps()

            // detect static features
            this.detectWebP()
            this.detectWebRTC()
            this.detectWebGL()
            this.detectPWA()

            window.addEventListener('resize', this.resizeFunc, true)
        }

        return this
    }

    public destroy() {
        if (window) {
            window.removeEventListener('resize', this.resizeFunc, true)
        }

        return this
    }

    public watch(callback:() => any) {
        return effect(callback)
    }

    private refreshProps() {
        // detect user agent first
        this.detectUserAgent()

        // detect properties that require on user agent
        this.detectOrientation()
        this.detectEvergreenBrowser()

        // delect viewport dimension
        this.reactiveDevice.viewportWidth = window.innerWidth
        this.reactiveDevice.viewportHeight = window.innerHeight
    }

    private detectUserAgent() {
        const detected:any = {
            browser: { name: null, version: null },
            deviceOS: null,
            deviceType: 'desktop',
        }
        const clientUA:any = navigator.userAgent.toLowerCase()
            || navigator.vendor.toLowerCase()
            || window.opera.toLowerCase()

        for (const [group, rules] of Object.entries(uaConfig)) {
            if (Array.isArray(rules)) {
                rules.forEach((rule:{name:string, regex:string[]}) => {
                    rule.regex.forEach((regex:string) => {
                        const reg:RegExp = new RegExp(regex.split('\\\\').join('\\'))
                        const match:RegExpMatchArray|null = reg.exec(clientUA)
                        const version = match && match[1] && match[1].split(/[._]/).slice(0, 3)

                        if (match && group === 'browser') {
                            detected[group].name = rule.name

                            if (version) {
                                if (Array.isArray(version) && version.length < 3) {
                                    version.concat(version.length == 1 ? ['0', '0'] : ['0'])
                                }
                                detected[group].version = version.join('.')
                            }
                        } else if (match) {
                            detected[group] = rule.name
                        }
                    })
                })
            }
        }

        this.reactiveDevice.browser = detected.browser.name
        this.reactiveDevice.browserVersion = detected.browser.version
        this.reactiveDevice.deviceOS = detected.deviceOS
        this.reactiveDevice.deviceType = detected.deviceType
    }

    private detectOrientation() {
        let orientation = 'landscape'

        if (this.reactiveDevice.deviceType 
            && ['mobile', 'tablet'].includes(this.reactiveDevice.deviceType)
            && window.matchMedia('(orientation: portrait)').matches
        ) {
            orientation = 'portrait'
        }

        this.reactiveDevice.deviceOrientation = orientation
    }

    private detectEvergreenBrowser() {
        this.reactiveDevice.isBrowserEvergreen = this.reactiveDevice.browser
            && ['chrome', 'safari', 'edge', 'firefox', 'opera'].includes(this.reactiveDevice.browser) 
            || false
    }

    private detectWebP() {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 1

        this.reactiveDevice.isSupportedWebP = canvas.toDataURL
            && canvas.toDataURL('image/webp')
            && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
            || false
    }

    private detectWebRTC() {
        /// <reference types="webrtc" />
        this.reactiveDevice.isSupportedWebRTC = typeof navigator.getUserMedia !== 'undefined'
            || typeof navigator.webkitGetUserMedia !== 'undefined'
            || typeof navigator.mozGetUserMedia !== 'undefined'
            || typeof navigator.msGetUserMedia !== 'undefined'
            || typeof window.RTCPeerConnection !== 'undefined'
    }

    private detectWebGL() {
        const canvas = document.createElement('canvas')
        this.reactiveDevice.isSupportedWebGL = !!window.WebGLRenderingContext
            && typeof (
                canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            ) !== 'undefined'
    }

    private detectPWA() {
        this.reactiveDevice.isPWA = (window.matchMedia('(display-mode: standalone)').matches)
            || (window.navigator.standalone)
            || document.referrer.includes('android-app://')
    }
}

interface DeviceProps {
    deviceOS: string | null
    deviceType: string | null
    deviceOrientation: string | null
    browser: string | null
    browserVersion: string | null
    viewportHeight: number | null
    viewportWidth: number | null
    isBrowserEvergreen: boolean | null
    isPWA: boolean | null
    isSupportedWebP: boolean | null
    isSupportedWebGL: boolean | null
    isSupportedWebRTC: boolean | null
}

declare global {
    interface Window {
        opera: any
    }
    interface Navigator {
        standalone: any
    }
}

const instance = new DeviceJS()

export const device = instance.device
export const watch = (callback: () => any) => instance.watch(callback)
