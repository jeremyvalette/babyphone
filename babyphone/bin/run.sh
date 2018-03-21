#!/bin/bash

# General
SERVER_URL='54.37.11.19'
# SERVER_URL='127.0.0.1:8000'
LD_LIBRARY_PATH=/usr/local/lib

echo "Looking for the uniq ID of the babyphone"

# teste si l'id unique a déjà été généré
if [ ! -f ./ID ]; then
  echo "ID not found, generating an uniq id for the babyphone"
  ID=$(uuidgen)
  echo "Saving id into ./ID"
  echo $ID > ID
else
  ID=$(head -n 1 ./ID)
fi

echo "Generated id: $ID"

# teste si ngrok est déjà en marche
if pgrep -x "ngrok" > /dev/null
then
    echo "ngrok is already running"
else
    echo "Starting ngrok"

    ngrok http --log=stdout 8080 > /dev/null &
    sleep 5
fi

echo "Gathering ngrok generated url"

URL=$(curl http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url')

echo "Sending to server"
echo " - url: $URL"
echo " - uniqid: $ID"

response=$(curl --write-out %{http_code} --silent --output /dev/null \
  -X POST \
  http://$SERVER_URL/babyphone \
  -H "cache-control: no-cache" \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "url=$URL&serial=$ID"
)


echo "Starting streaming..."

mkdir /tmp/stream
raspistill --nopreview -w 320 -h 240 -q 5 -o /tmp/stream/pic.jpg -tl 500 -t 0 &
mjpg_streamer -i "input_file.so -f /tmp/stream -n pic.jpg" -o "output_http.so -w ./www" &
