#!/bin/bash
cd ./api
npm install
cd ../
cd ./ui
npm install
cd ../
docker-compose up