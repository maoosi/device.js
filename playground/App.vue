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
import { device } from '../dist'

export default {
    data() {
        return { deviceInfo: device }
    }
}
</script>
