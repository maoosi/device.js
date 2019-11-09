# Device.js

🧬JavaScript library to detect browser and devices properties.


## Features detected

- Browser name & version `chrome, safari, firefox, facebook, instagram, edge, ie, opera, phantomjs`
- Supported features `pwa, webp, webrtc, webgl`
- Device orientation `portrait, landscape`
- Mobile OS `android, ios, windows`
- Virtual keyboard `active, inactive`


## Getting started

```javascript
import Device from 'device.js'

// Instantiate library
const device = new Device()

// Read device properties
device.get('browser')
device.get('browser.name')
device.get('browser.version')
device.get('mobileOs')
device.get('type')
device.get('orientation')
device.get('virtualKeyboard')

// Refresh detection of properties
device.detect()

// Events
device.on('orientationUpdate', (orientation) => {})
device.on('virtualKeyboardUpdate', (state) => {})
device.on('propertiesUpdate', () => {})

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
device.isBrowserEq('ie', '8')
device.isBrowserLt('ie', '11.1')
device.isBrowserGt('ie', '8.0.1')
device.isBrowserLtEq('ie', '9')
device.isBrowserGtEq('ie', '9.1')

// Supported features
device.isSupported('webp')
device.isSupported('webrtc')
device.isSupported('webgl')

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
device.isVirtualKeyboard('active')
device.isVirtualKeyboard('inactive')
```
