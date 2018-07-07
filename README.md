# Device.js

⚠️ Work in progress | Not ready for production

> 🎲 ES6 toolkit library to detect device and browser information.


## Features detected

- Browser name & version `chrome, safari, firefox, facebook, instagram, edge, ie, opera, phantomjs`
- Supported features `pwa, webp, webrtc`
- Device orientation `portrait, landscape`
- Mobile OS `android, ios, windows`
- Virtual keyboard `active, inactive`


## Getting started

```javascript
import Device from 'device.js'

// Instantiate library
const device = new Device()

// Global API methods
device.get('browser')
device.get('browser.name')
device.get('browser.version')
device.get('mobileOs')
device.get('type')
device.get('orientation')
// wip -> device.get('virtualKeyboard')
device.detect() // Force re-detection

// Events
// wip -> device.on('virtualKeyboardUpdate', (state) => {})
// wip -> device.on('orientationUpdate', (orientation) => {})

// Browser name
device.isBrowser('chrome')
device.isBrowser('safari')
device.isBrowser('firefox')
device.isBrowser('facebook')
device.isBrowser('instagram')
device.isBrowser('edge')
device.isBrowser('ie')
device.isBrowser('opera')
device.isBrowser('phantomjs')

// Browser version
// wip -> device.isBrowserEq('ie', '8')
// wip -> device.isBrowserLt('ie', '11.1')
// wip -> device.isBrowserGt('ie', '8.0.1')
// wip -> device.isBrowserLtEq('ie', '9')
// wip -> device.isBrowserGtEq('ie', '9.1')

// Supported features
device.isSupported('webp')
// wip -> device.isSupported('pwa')
// wip -> device.isSupported('webrtc')

// Device orientation
device.isOrientation('portrait')
device.isOrientation('landscape')

// Mobile Operating System
device.isMobileOs('android')
device.isMobileOs('ios')
device.isMobileOs('windows')

// Device type
device.isType('desktop')
device.isType('mobile')
device.isType('tablet')
device.isType('tv')

// Mobile virtual keyboard
// wip -> device.isVirtualKeyboard('active')
// wip -> device.isVirtualKeyboard('inactive')
```
