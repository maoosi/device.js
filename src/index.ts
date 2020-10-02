import { reactive } from '@vue/reactivity'
import throttle from 'lodash.throttle'
const uaConfig = require('./ua.json')

class DeviceJS {
    public device: DeviceProps
    private options: DeviceJSOptions
    private resizeFunc: any
    private viewportHeightMemory: number | null
    private viewportWidthMemory: number | null

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
            isKeyboardOpen: null,
            isBrowserEvergreen: null,
        
            // browser features
            isSupportedWebP: null,
            isSupportedWebGL: null,
            isSupportedWebRTC: null,
        })

        this.viewportHeightMemory = null
        this.viewportWidthMemory = null
        this.resizeFunc = throttle(() => this.refreshProps(), this.options.refreshRate)

        if (this.options.watch) {
            this.init()
        }

        return this
    }

    public init() {
        if (window) {
            this.refreshProps()
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
        this.detectWebP()
        this.detectWebRTC()
        this.detectWebGL()

        // delect viewport dimension
        this.viewportWidthMemory = this.device.viewportWidth
        this.viewportHeightMemory = this.device.viewportHeight
        this.device.viewportWidth = window.innerWidth
        this.device.viewportHeight = window.innerHeight

        // detect keyboard last
        this.detectKeyboardStatus()
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

    private detectKeyboardStatus() {
        const isCompatibleDevice = this.device.deviceType
            && ['mobile', 'tablet'].includes(this.device.deviceType)
        const isActiveElement = document.activeElement
            && document.activeElement.tagName.toLowerCase() 
            || null
        const isInputFocused = isActiveElement
            && ['input', 'textarea'].includes(isActiveElement)
        const isHeightReduced = this.viewportHeightMemory
            && this.viewportWidthMemory
            && this.device.viewportWidth
            && this.device.viewportHeight
            && this.device.viewportWidth === this.viewportWidthMemory
            && this.device.viewportHeight < this.viewportHeightMemory

        if (isCompatibleDevice && isHeightReduced && isInputFocused) {
            this.device.isKeyboardOpen = true
        } else {
            this.device.isKeyboardOpen = false
        }
    }

    private detectEvergreenBrowser() {
        this.device.isBrowserEvergreen = this.device.browser
            && ['chrome', 'safari', 'edge', 'firefox', 'opera'].includes(this.device.browser) 
            || null
    }

    private detectWebP() {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 1

        this.device.isSupportedWebP = canvas.toDataURL
            && canvas.toDataURL('image/webp')
            && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
            || null
    }

    private detectWebRTC() {
        /// <reference types="webrtc" />
        this.device.isSupportedWebRTC = typeof navigator.getUserMedia !== 'undefined'
            || typeof navigator.webkitGetUserMedia !== 'undefined'
            || typeof navigator.mozGetUserMedia !== 'undefined'
            || typeof navigator.msGetUserMedia !== 'undefined'
            || typeof window.RTCPeerConnection !== 'undefined'
            || null
    }

    private detectWebGL() {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        this.device.isSupportedWebGL = gl && gl instanceof WebGLRenderingContext
    }

    // Overscroll
    public disableOverscroll() {
        return this
    }
    public enableOverscroll() {
        return this
    }

    // Double-tap zoom
    public disableDoubleTapZoom() {
        return this
    }
    public enableDoubleTapZoom() {
        return this
    }

    // Auto-hide bottom toolbar on iOS
    public disableToolbarAutohide() {
        return this
    }
    public enableToolbarAutohide() {
        return this
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
    isKeyboardOpen: boolean | null
    isBrowserEvergreen: boolean | null
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
}

const instance = new DeviceJS({ watch: true })
const device = instance.device
const disableOverscroll = () => instance.disableOverscroll()
const enableOverscroll = () => instance.enableOverscroll()
const disableDoubleTapZoom = () => instance.disableDoubleTapZoom()
const enableDoubleTapZoom = () => instance.enableDoubleTapZoom()
const disableToolbarAutohide = () => instance.disableToolbarAutohide()
const enableToolbarAutohide = () => instance.enableToolbarAutohide()

export {
    device,
    disableOverscroll,
    enableOverscroll,
    disableDoubleTapZoom,
    enableDoubleTapZoom,
    disableToolbarAutohide,
    enableToolbarAutohide,
}