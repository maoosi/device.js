<template>
    <div>
        <ul>
            <li v-for="(propValue, propName) in deviceInfo" :key="`${propName}-${propValue}`">
                <strong>{{ propName }}:</strong> {{ propValue !== null ? propValue : 'n/a' }}
            </li>
        </ul>
    </div>
</template>

<script>
import { device, watch } from '../dist'

export default {
    data() {
        return {
            deviceInfo: false
        }
    },
    mounted() {
        watch(async() => {
            this.deviceInfo = this.copyDeep(device)
        })
    },
    methods: {
        copyDeep(object) {
            return JSON.parse(JSON.stringify(object))
        }
    }
}
</script>
