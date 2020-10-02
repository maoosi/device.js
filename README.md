# Device.js

🧬 Reactive utility library to detects browser and device properties.

## ✔️ Features detected

- Browser name & version `chrome, safari, firefox, facebook, instagram, edge, ie, opera, phantomjs`
- Browser features `webp, webrtc, webgl`
- Device orientation `portrait, landscape`
- Device type `desktop, mobile, tablet, tv`
- Device OS `android, ios, windows, macos`
- Mobile keyboard `open, close`
- Viewport dimensions `width, height`

## 📦 Installation

```sh
yarn add @maoosi/device.js
```

## 🚀 Usage

```javascript
import { device } from '@maoosi/device.js'
```

`device` returns a reactive proxied object that can be observed:

```typescript
interface device {
    deviceOS: string | null
    deviceType: string | null
    deviceOrientation: string | null
    browser: string | null
    browserVersion: string | null
    viewportHeight: number | null
    viewportWidth: number | null
    isKeyboardOpen: boolean | null
    isBrowserEvergreen: boolean | null
    isSupportedWebP: boolean | null
    isSupportedWebGL: boolean | null
    isSupportedWebRTC: boolean | null
}
```

Example with Vue.js:

> `deviceInfo` is reactive, meaning Vue.js can observe its change and update the view in real-time

```html
<template>
    <ul>
        <li v-for="(propValue, propName) in deviceInfo" :key="prop">
            <strong>{{ propName }}:</strong> {{ propValue || 'n/a' }}
        </li>
    </ul>
</template>

<script>
import { device } from '@maoosi/device.js'

export default {
    data() {
        return { deviceInfo: device }
    }
}
</script>
```

## 🧪 Run the playground

First, make sure you have Vue.js Instant Prototyping service installed: [https://cli.vuejs.org/guide/prototyping.html](https://cli.vuejs.org/guide/prototyping.html)

Then from terminal:

```sh
yarn playground
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

## 📝 License

Copyright © 2020 [maoosi](https://gitlab.com/maoosi).

This project is [MIT](./LICENSE) licensed.
