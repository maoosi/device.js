<template>
    <ul>
        <li v-for="(propValue, propName) in deviceInfo" :key="`${propName}-${propValue}`">
            <strong>{{ propName }}:</strong> {{ propValue || 'n/a' }}
        </li>
    </ul>
</template>

<script>
import { device } from '../dist'

export default {
    data() {
        return { deviceInfo: device }
    }
}
</script>
