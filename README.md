# tslint-sinon
This package provides TSLint rules for Sinon mocking library (currently only one rule)

## Rules

* `sinon-prefer-resolves` - suggests to use `stub.resolves(x)` instead of `stub.returns(Promise.resolve(x))`

## How to install

* Run `npm install --save-dev tslint-sinon`
* Add to your `tslint.json`:

```json
  "rules": {
    "sinon-prefer-resolves": true
  },
  "rulesDirectory": [
    "tslint-sinon"
  ]
```
