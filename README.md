# 🧬 Device.js

**Reactive library to observe essential browser and device properties.**

> ⚠️ Version 2 is not backward compatible with version 1. Check the [Changelog](CHANGELOG.md) for more details.

## ✔️ Features detected

- Browser name & version `chrome, safari, firefox, facebook, instagram, edge, ie, opera, phantomjs`
- Browser features `webp, webrtc, webgl, pwa`
- Device orientation `portrait, landscape`
- Device type `desktop, mobile, tablet, tv`
- Device OS `android, ios, windows, macos`
- Viewport dimensions `width, height`

## 📦 Installation

```sh
yarn add @maoosi/device.js
```

## 🚀 Usage

**Basic usage:**

This code will log `viewportWidth` after every viewport resize, throttled to 200 ms:

```javascript
import { device, watch } from '@maoosi/device.js'

watch(async() => {
    console.log(device.viewportWidth)
})
```

`device` is a reactive proxied object that can be observed and exposes the following properties:

```typescript
interface device {
    deviceOS: string | null
    deviceType: string | null
    deviceOrientation: string | null
    browser: string | null
    browserVersion: string | null
    viewportHeight: number | null
    viewportWidth: number | null
    isBrowserEvergreen: boolean | null
    isPWA: boolean | null
    isSupportedWebP: boolean | null
    isSupportedWebGL: boolean | null
    isSupportedWebRTC: boolean | null
}
```

**Using Vue.js:**

Since `device` is a reactive proxied object, Vue.js can observe changes without needing to use the `watch` method:

```html
<template>
    <pre>{{ deviceInfo }}</pre>
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

Then from your terminal:

```sh
yarn playground
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

## 📝 License

Copyright © 2021 [maoosi](https://gitlab.com/maoosi).

This project is [MIT](./LICENSE) licensed.
