# Changelog

## Version 2.0

> ⚠️ Device.js version 2 is not retro-compatible with previous versions, make sure you read the doc before migrating.

- Library rewritten from the ground up using TypeScript and the [@vue/reactivity](https://v3.vuejs.org/guide/reactivity.html#what-is-reactivity) package, which allows creating trully reactive objects that can be observed.
- Simplified implementation and usage. Instead of exposing numerous methods and events, the library simply return a plain old javascript object with built-in reactivity.
- Removed virtual keyboard state detection as it is not anymore compatible with modern versions of iOS/Safari.
- Added PWA detection (return true if your page is running in a standalone PWA mode).
- Added viewport dimensions detection (usefull to overcome the 100vh issue in mobile WebKit).
- Updated all user agent detection rules to align with modern usages.
- Tests added to make sure the library can cover most scenarios.
