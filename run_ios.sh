#!/bin/bash
IP=`ifconfig en1 | grep inet | grep -v inet6 | awk '{print $2}'`
PORT=3000

export HMR_URL=$IP
export HMR_PORT=3003
export ROOT_URL=http://$IP:$PORT
export VUE_DEV_SERVER_URL=http://$HMR_URL:$HMR_PORT
echo "{\"public\": {\"devServerURL\": \"$VUE_DEV_SERVER_URL\"}}" > ./settings-temp.json
echo "Starting app on ios device..."

meteor run ios-device --mobile-server=http://$IP:$PORT --settings settings-temp.json
