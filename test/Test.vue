<template>
    <div>
        <ul>
            <li><strong>Browser name:</strong> {{ browserName || 'n/a' }}</li>
            <li><strong>Browser version:</strong> {{ browserVersion || 'n/a' }}</li>
            <li><strong>Mobile OS:</strong> {{ mobileOs || 'n/a' }}</li>
            <li><strong>Type:</strong> {{ type || 'n/a' }}</li>
            <li><strong>Orientation:</strong> {{ orientation || 'n/a' }}</li>
        </ul>
    </div>
</template>

<script>
import Device from '../src/index.js'

const device = new Device({
    autoUpdateOnResize: true
})

export default {
    data () {
        return {
            browser: null,
            browserName: null,
            browserVersion: null,
            mobileOs: null,
            type: null,
            orientation: null
        }
    },
    mounted () {
        device.on('orientationUpdate', (orientation) => {
            this.orientation = orientation
        })

        device.on('update', () => {
            this.detect()
        })

        this.detect()
    },
    methods: {
        detect () {
            this.browser = device.get('browser')
            this.browserName = device.get('browser.name')
            this.browserVersion = device.get('browser.version')
            this.mobileOs = device.get('mobileOs')
            this.type = device.get('type')
            this.orientation = device.get('orientation')
        }
    }
}
</script>