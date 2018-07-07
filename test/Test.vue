<template>
    <div>
        <ul>
            <li><strong>Browser name:</strong> {{ browser ? browser.name : 'n/a' }}</li>
            <li><strong>Browser version:</strong> {{ browser ? browser.version : 'n/a' }}</li>
            <li><strong>Mobile OS:</strong> {{ mobileOs ? mobileOs.name : 'n/a' }}</li>
            <li><strong>Type:</strong> {{ type ? type.name : 'n/a' }}</li>
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
            mobileOs: null,
            type: null
        }
    },
    mounted () {
        this.browser = device.get('browser')
        this.mobileOs = device.get('mobileOs')
        this.type = device.get('type')
    }
}
</script>