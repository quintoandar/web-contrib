# web-contrib
Extensions for dependencies we use on Web Projects (PWA).

Code in this package comes from those sources:
- https://github.com/react-boilerplate/react-boilerplate/

## How to release a new version

- Check that all tests are passing
- Make sure you're bumping the version acccording to https://semver.org/ 
- run `npm publish`

# Available extension features

## react-redux

### injectReducer

A HOC to inject reducers into the store. 
Based on [inject reducer](https://github.com/react-boilerplate/react-boilerplate/blob/master/internals/templates/utils/injectReducer.js)

## General guidelines

Please checkout our PWA general [guidelines](guidelines.md).
