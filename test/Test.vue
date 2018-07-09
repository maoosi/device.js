<template>
    <div>
        <ul>
            <li><strong>Browser name:</strong> {{ browserName || 'n/a' }}</li>
            <li><strong>Browser version:</strong> {{ browserVersion || 'n/a' }}</li>
            <li><strong>Mobile OS:</strong> {{ mobileOs || 'none' }}</li>
            <li><strong>Type:</strong> {{ type || 'n/a' }}</li>
            <li><strong>Orientation:</strong> {{ orientation || 'n/a' }}</li>
            <li><strong>Virtual keyboard:</strong> {{ virtualKeyboard || 'n/a' }}</li>
            <li><strong>WebP support:</strong> {{ webp ? 'yes' : 'no' }}</li>
            <li><strong>WebRTC support:</strong> {{ webrtc ? 'yes' : 'no' }}</li>
            <li><strong>WebGL support:</strong> {{ webgl ? 'yes' : 'no' }}</li>
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
            type: null,
            orientation: null,
            webrtc: null,
            webp: null,
            webgl: null,
            virtualKeyboard: null
        }
    },
    mounted () {
        device.on('orientationUpdate', (orientation) => {
            this.orientation = orientation
        })

        device.on('propertiesUpdate', () => {
            this.displayProperties()
        })

        this.displayProperties()
    },
    methods: {
        displayProperties () {
            this.browser = device.get('browser')
            this.browserName = device.get('browser.name')
            this.browserVersion = device.get('browser.version')
            this.mobileOs = device.get('mobileOs')
            this.type = device.get('type')
            this.orientation = device.get('orientation')
            this.webrtc = device.isSupported('webrtc')
            this.webp = device.isSupported('webp')
            this.webgl = device.isSupported('webgl')
            this.virtualKeyboard = device.get('virtualKeyboard')
        }
    }
}
</script>