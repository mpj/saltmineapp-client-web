#!/bin/bash
jsx src/ build/
browserify build/index.js -o static/bundle.js
