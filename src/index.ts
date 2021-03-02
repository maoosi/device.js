import { reactive } from '@vue/reactivity'
import throttle from 'lodash-es/throttle'

const uaConfig = require('./ua.json')

class DeviceJS {
    public device: DeviceProps
    private options: DeviceJSOptions
    private resizeFunc: any

    constructor(options?:DeviceJSUserOptions) {
        this.options = {
            watch: options && options.watch || false,
            refreshRate: options && options.refreshRate || 200
        }

        this.device = reactive({
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

        this.resizeFunc = throttle(() => this.refreshProps(), this.options.refreshRate)

        if (this.options.watch) {
            this.init()
        }

        return this
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

    private refreshProps() {
        // detect user agent first
        this.detectUserAgent()

        // detect properties that require on user agent
        this.detectOrientation()
        this.detectEvergreenBrowser()

        // delect viewport dimension
        this.device.viewportWidth = window.innerWidth
        this.device.viewportHeight = window.innerHeight
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

        this.device.browser = detected.browser.name
        this.device.browserVersion = detected.browser.version
        this.device.deviceOS = detected.deviceOS
        this.device.deviceType = detected.deviceType
    }

    private detectOrientation() {
        let orientation = 'landscape'

        if (this.device.deviceType 
            && ['mobile', 'tablet'].includes(this.device.deviceType)
            && window.matchMedia('(orientation: portrait)').matches
        ) {
            orientation = 'portrait'
        }

        this.device.deviceOrientation = orientation
    }

    private detectEvergreenBrowser() {
        this.device.isBrowserEvergreen = this.device.browser
            && ['chrome', 'safari', 'edge', 'firefox', 'opera'].includes(this.device.browser) 
            || false
    }

    private detectWebP() {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 1

        this.device.isSupportedWebP = canvas.toDataURL
            && canvas.toDataURL('image/webp')
            && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
            || false
    }

    private detectWebRTC() {
        /// <reference types="webrtc" />
        this.device.isSupportedWebRTC = typeof navigator.getUserMedia !== 'undefined'
            || typeof navigator.webkitGetUserMedia !== 'undefined'
            || typeof navigator.mozGetUserMedia !== 'undefined'
            || typeof navigator.msGetUserMedia !== 'undefined'
            || typeof window.RTCPeerConnection !== 'undefined'
    }

    private detectWebGL() {
        const canvas = document.createElement('canvas')
        this.device.isSupportedWebGL = !!window.WebGLRenderingContext
            && typeof (
                canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            ) !== 'undefined'
    }

    private detectPWA() {
        this.device.isPWA = (window.matchMedia('(display-mode: standalone)').matches)
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

interface DeviceJSOptions {
    watch: boolean
    refreshRate: number
}

interface DeviceJSUserOptions {
    watch?: boolean
    refreshRate?: number
}

declare global {
    interface Window {
        opera: any
    }
    interface Navigator {
        standalone: any
    }
}

const instance = new DeviceJS({ watch: true })

export const device = instance.device