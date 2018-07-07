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
        return this.detected ? this.detected[key] : null
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

                    if (version) {
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