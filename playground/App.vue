<template>
    <ul>
        <li v-for="(value, prop) in deviceInfo" :key="prop">
            <strong>{{ prop }}:</strong> {{ value || 'n/a' }}
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
