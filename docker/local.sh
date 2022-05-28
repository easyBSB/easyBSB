#!/bin/bash

(npm start -- easybsb-server 2>&1 | sed 's/^/SERVER> /'   &
 npm start -- easybsb-client --disableHostCheck --poll 500 2>&1 | sed 's/^/   WEB> /' ) &
nginx-debug -c /usr/share/easybsb/docker/nginx/nginx.conf -g "daemon off;" 2>&1 | sed 's/^/NGINX> /' &
(cd /usr/share/easybsb/docker/nginx/; npx sane '/usr/sbin/nginx -s reload' -o --glob='**/*.conf') 2>&1 | sed 's/^/ NGINX> /'
