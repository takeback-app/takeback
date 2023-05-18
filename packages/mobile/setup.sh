#!/bin/bash -xv

yarn install
rm -rf node_modules/react-native-cli

npx pod-install ios
