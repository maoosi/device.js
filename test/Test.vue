<template>
    <div>
        <ul>
            <li><strong>Browser name:</strong> {{ browserName || 'n/a' }}</li>
            <li><strong>Browser version:</strong> {{ browserVersion || 'n/a' }}</li>
            <li><strong>Mobile OS:</strong> {{ mobileOs || 'n/a' }}</li>
            <li><strong>Type:</strong> {{ type || 'n/a' }}</li>
        </ul>
    </div>
</template>

<script>
import Device from '../src/index.js'

const device = new Device()

export default {
    data () {
        return {
            browser: null,
            browserName: null,
            browserVersion: null,
            mobileOs: null,
            type: null
        }
    },
    mounted () {
        this.browser = device.get('browser')
        this.browserName = device.get('browser.name')
        this.browserVersion = device.get('browser.version')
        this.mobileOs = device.get('mobileOs')
        this.type = device.get('type')
    }
}
</script>