#!/bin/bash -xv

rm -rf "$TMPDIR/react-*"
rm -rf "$TMPDIR/haste-*"
rm -rf "$TMPDIR/metro-*"
watchman watch-del-all


xcodebuild -project ios/app.xcodeproj -configuration Release clean
xcodebuild -project ios/app.xcodeproj -configuration Debug clean
xcodebuild -workspace ios/app.xcworkspace -scheme app -configuration Release clean
xcodebuild -workspace ios/app.xcworkspace -scheme app -configuration Debug clean
rm -rf ~/Library/Developer/Xcode/DerivedData

#(cd ios && pod deintegrate)
rm -rf ios/build
rm -rf ios/Pods

rm -rf android/build
(cd android && ./gradlew clean cleanBuildCache)
rm -rf android/app/build


rm -rf node_modules
rm -rf ~/.rncache
yarn cache clean
#rm yarn.lock

rm -rf android/.gradle
find . -name .DS_Store -exec rm -rf {} \;

git clean -xdn
#yarn install

