#!/bin/bash

# todo poll only for windows
nginx
npm start -- server --host 0.0.0.0 2>&1 &
npm start -- web --host 0.0.0.0 --disableHostCheck --poll 500 2>&1
