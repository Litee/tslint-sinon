# tslint-sinon
This package provides additional TSLint rules that help to enforce some best practices when using Sinon mocking library.

## Supported rules

* `sinon-prefer-resolves` - suggests to use `stub.resolves(x)` instead of `stub.returns(Promise.resolve(x))`.
* `sinon-prefer-sandbox` - suggests to create fakes via `sandbox` instead of creating them directly.

## How to install

* Run `npm install --save-dev tslint-sinon`
* Add to your `tslint.json`:

```json
  "rules": {
    "sinon-prefer-resolves": true,
    "sinon-prefer-sandbox": true
  },
  "rulesDirectory": [
    "tslint-sinon"
  ]
```

## Status

[![Build Status](https://travis-ci.org/Litee/tslint-sinon.png)](https://travis-ci.org/Litee/tslint-sinon)
