import debounce from 'lodash.debounce'
import mitt from 'mitt'
import ua from './ua.js'

export default class {
    
    constructor (options = {}) {
        this.options = {
            refreshAfterResize: options.refreshAfterResize || true,
            keyboardDetectDelay: options.keyboardDetectDelay || 3000
        }

        this.emitter = mitt()
        this.init()

        return this
    }

    init () {
        this.isKeyboardOpen = false
        this._detectKeyboardStatus()
        this._bindEvents()
        this.detect()

        return this
    }

    destroy () {
        this._unbindEvents()

        if (this.keyboardDetectTimeout) {
            clearTimeout(this.keyboardDetectTimeout)
            this.keyboardDetectTimeout = false
        }

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
                case 'orientation':
                    return this.detected['orientation']
                case 'type':
                    return this.detected['type'].name
                case 'mobileOs':
                    return this.detected['mobileOs'].name
                case 'virtualKeyboard':
                    return this.isKeyboardOpen ? 'active' : 'inactive'
                default:
                    return false
            }
        } else {
            return false
        }
    }

    isBrowser (name) {
        return this.get('browser.name') === name
    }

    isBrowserEq (browser, version) {
        return this._isBrowserVersion(browser, '===', version)
    }

    isBrowserLt (browser, version) {
        return this._isBrowserVersion(browser, '<', version)
    }

    isBrowserGt (browser, version) {
        return this._isBrowserVersion(browser, '>', version)
    }

    isBrowserLtEq (browser, version) {
        return this._isBrowserVersion(browser, '<=', version)
    }

    isBrowserGtEq (browser, version) {
        return this._isBrowserVersion(browser, '>=', version)
    }

    isType (name) {
        return this.get('type') === name
    }

    isMobileOs (name) {
        return this.get('mobileOs') === name
    }

    isOrientation (orientation) {
        return this.get('orientation') === orientation
    }

    isVirtualKeyboard (state) {
        return this.get('virtualKeyboard') === state
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

    _storeViewportDimensions () {
        this.viewportWidth = window.innerWidth
        this.viewportHeight = window.innerHeight
    }

    _isBrowserVersion (browser, operator, version) {
        if (browser !== this.get('browser.name')) return false

        let compare = {
            '===':  (a, b) => { return a === b },
            '<':    (a, b) => { return a < b },
            '>':    (a, b) => { return a > b },
            '<=':   (a, b) => { return a <= b },
            '>=':   (a, b) => { return a >= b }
        }

        let detected = this.get('browser.version').split('.')
        let compared = version.split('.')

        for (let i = 0; i < detected.length; i++) {
            if (!compared[i]) {
                detected[i] = '0'
                compared[i] = '0'
            }
        }

        detected = parseInt(detected.join(''))
        compared = parseInt(compared.join(''))

        return compare[operator](detected, compared)
    }

    _detectKeyboardStatus () {
        if (this.isType('mobile') || this.isType('tablet')) {

            if (this.keyboardDetectTimeout) {
                clearTimeout(this.keyboardDetectTimeout)
                this.keyboardDetectTimeout = false
            }

            this.keyboardDetectTimeout = setTimeout(() => {
                let currentWidth = window.innerWidth
                let currentHeight = window.innerHeight
                let isInputFocused = document.activeElement.tagName.toLowerCase() === 'input'

                if (
                    !this.isKeyboardOpen &&
                    currentWidth === this.viewportWidth &&
                    currentHeight < this.viewportHeight &&
                    isInputFocused
                ) {
                    this.isKeyboardOpen = true
                    this.emitter.emit('virtualKeyboardUpdate', this.get('virtualKeyboard'))
                } else if (
                    (this.isKeyboardOpen && !isInputFocused) ||
                    (
                        this.isKeyboardOpen &&
                        isInputFocused &&
                        currentWidth === this.viewportWidth && 
                        currentHeight > this.viewportHeight
                    )
                ) {
                    this.isKeyboardOpen = false
                    this.emitter.emit('virtualKeyboardUpdate', this.get('virtualKeyboard'))
                }

                this.viewportWidth = currentWidth
                this.viewportHeight = currentHeight
            }, this.options.keyboardDetectDelay)

        }
    }

    _detectFromUa (key, defaultValue = false) {
        this.detected[key] = defaultValue

        for (let test of ua[key]) {
            for (let rule of test.rules) {
                let match = rule.exec(this.clientUA)
                let version = match && match[1] && match[1].split(/[._]/).slice(0,3)

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
        let previousOrientation = this.get('orientation')
        this.detected['orientation'] = 'landscape'

        if (
            (this.isType('mobile') || this.isType('tablet')) &&
            window.matchMedia('(orientation: portrait)').matches
        ) {
            this.detected['orientation'] = 'portrait'
        }

        if (previousOrientation !== this.get('orientation')) {
            this.emitter.emit('orientationUpdate', this.get('orientation'))
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
        this._detectKeyboardStatus()

        if (this.options.refreshAfterResize) {
            let previousDetected = this.detected
            this.detect()

            if (previousDetected !== this.detected) {
                this.emitter.emit('propertiesUpdate')
            }
        } else {
            this._detectOrientation()
        }
    }

}