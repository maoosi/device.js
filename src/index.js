import debounce from 'lodash.debounce'
import mitt from 'mitt'
import ua from './ua.js'

export default class {
    
    constructor (options = {}) {
        this.options = {
            autoUpdateOnResize: options.autoUpdateOnResize || true
        }

        this.emitter = mitt()
        this.init()

        return this
    }

    init () {
        this._saveHeight()
        this._bindEvents()
        this.detect()

        return this
    }

    destroy () {
        this._unbindEvents()

        return this
    }

    detect () {
        this.detected = []
        this.clientUA =
            navigator.userAgent.toLowerCase() ||
            navigator.vendor.toLowerCase() ||
            window.opera.toLowerCase()
        
        this._detectFromUa('browser')
        this._detectFromUa('mobileOs')
        this._detectFromUa('type', { name: 'desktop' })
        this._detectOrientation()

        return this
    }

    get (key) {
        if (this.detected) {
            switch (key) {
                case 'browser':
                    return this.detected['browser']
                case 'browser.name':
                    return this.detected['browser'].name
                case 'browser.version':
                    return this.detected['browser'].version
                default:
                    return typeof this.detected[key] !== 'undefined' && typeof this.detected[key].name !== 'undefined'
                        ? this.detected[key].name
                        : this.detected[key]
            }
        } else {
            return false
        }
    }

    isBrowser (name) {
        return this.detected && this.detected['browser'].name === name
    }

    isBrowserEq (browser, version) {
        return this._compareBrowser(browser, '===', version)
    }

    isBrowserLt (browser, version) {
        return this._compareBrowser(browser, '<', version)
    }

    isBrowserGt (browser, version) {
        return this._compareBrowser(browser, '>', version)
    }

    isBrowserLtEq (browser, version) {
        return this._compareBrowser(browser, '<=', version)
    }

    isBrowserGtEq (browser, version) {
        return this._compareBrowser(browser, '>=', version)
    }

    _compareBrowser (browser, operator, version) {
        if (browser !== this.detected['browser'].name) return false

        let compare = {
            '===': (a, b) => { return a === b },
            '<': (a, b) => { return a < b },
            '>': (a, b) => { return a > b },
            '<=': (a, b) => { return a <= b },
            '>=': (a, b) => { return a >= b }
        }

        let detected = this.detected['browser'].version.split('.')
        let targeted = version.split('.')

        for (let i = 0; i < detected.length; i++) {
            let diff = detected[i].length - (targeted[i] ? targeted[i].length : 0)

            while (diff > 0) {
                targeted[i] = (targeted[i] || '') + '0'
                diff = diff - 1
            }
        }

        detected = parseInt(detected.join(''))
        targeted = parseInt(targeted.join(''))

        return compare[operator](detected, targeted)
    }

    isType (name) {
        return this.detected && this.detected['type'].name === name
    }

    isMobileOs (name) {
        return this.detected && this.detected['mobileOs'].name === name
    }

    isOrientation (orientation) {
        return this.detected && this.detected['orientation'] === orientation
    }

    isSupported (feature) {
        switch (feature) {
            case 'webp':
                return Boolean(this._isWebpSupported())
            case 'webrtc':
                return Boolean(this._isWebRtcSupported())
            case 'webgl':
                return Boolean(this._isWebGlSupported())
            default:
                return false
        }
    }

    on(...args) { return this.emitter.on(...args) }
    off(...args) { return this.emitter.off(...args) }

    _bindEvents () {
        this.resize = debounce(() => {
            this._resize()
        }, 100)

        window.addEventListener('resize', this.resize, false)
    }

    _unbindEvents () {
        window.removeEventListener('resize', this.resize, false)
    }

    _saveHeight () {
        this.defaultHeight = window.innerHeight
    }

    _detectFromUa (key, defaultValue = false) {
        this.detected[key] = defaultValue

        for (let test of ua[key]) {
            for (let rule of test.rules) {
                let match = rule.exec(this.clientUA)
                let version = match && match[1].split(/[._]/).slice(0,3)

                if (match) {
                    this.detected[key] = { name: test.name }

                    if (version && key === 'browser') {
                        if (version.length < 3) {
                            version.concat(version.length == 1 ? [0, 0] : [0])
                        }
                        this.detected[key]['version'] = version.join('.')
                    }

                    break
                }
            }

            if (this.detected[key]) break
        }
    }

    _detectOrientation () {
        let previousOrientation = this.detected['orientation']
        this.detected['orientation'] = 'landscape'

        if (
            (this.isType('mobile') || this.isType('tablet')) &&
            window.matchMedia('(orientation: portrait)').matches
        ) {
            this.detected['orientation'] = 'portrait'
        }

        if (previousOrientation !== this.detected['orientation']) {
            this.emitter.emit('orientationUpdate', this.detected['orientation'])
        }
    }

    _isWebpSupported () {
        let canvas = document.createElement('canvas')
        canvas.width = canvas.height = 1

        return canvas.toDataURL 
            && canvas.toDataURL('image/webp') 
            && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }

    _isWebRtcSupported () {
        return navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia ||
            window.RTCPeerConnection
    }

    _isWebGlSupported () {
        let canvas = document.createElement('canvas')
        let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        return gl && gl instanceof WebGLRenderingContext
    }

    _resize () {
        if (this.options.autoUpdateOnResize) {
            let previousDetected = this.detected
            this.detect()

            if (previousDetected !== this.detected) {
                this.emitter.emit('update')
            }
        } else {
            this._detectOrientation()
        }
    }

}