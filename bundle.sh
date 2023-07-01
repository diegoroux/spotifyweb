#!/bin/bash

mkdir -p dist/

# common-core files do not implement any code that only runs on Node, apart from 'exports'. 
# In order to bundle them for a browser, we just need to get rid of any 'exports' use.

cat $(find src/ -iname '*.js' ! -name 'browser.js' ! -name 'server.js') src/browser.js | sed '/exports/d' - > dist/browser.js

npx uglify-js dist/browser.js > dist/browser.min.js