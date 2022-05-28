#!/bin/bash

# todo poll only for windows
nginx
npm start -- client --host 0.0.0.0 2>&1 & &&
npm start -- client --host 0.0.0.0 --disableHostCheck --poll 500 2>&1
