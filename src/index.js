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
                return this._isWebpSupported()
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

    _resize () {
        if (this.options.autoUpdateOnResize) {
            this.detect()
            this.emitter.emit('update')
        } else {
            this._detectOrientation()
        }
    }

}