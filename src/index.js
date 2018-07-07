import ua from './ua.js'

export default class {
    
    constructor () {
        this.detect()
    }

    detect () {
        this.clientUA = navigator.userAgent.toLowerCase()
        this.detected = []

        this._detectFromUa('browser')
        this._detectFromUa('mobileOs')
        this._detectFromUa('type', { name: 'desktop' })
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

    _resize () {

    }

}