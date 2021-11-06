#!/usr/bin/env bash
echo "=========================="
echo "start build container"
echo "----------------"

docker container stop mafia-front
docker container rm mafia-front
docker build -t mafia-front .
docker run -p 8000:80 mafia-front
echo "=========================="
echo "finish build container"
echo "----------------"