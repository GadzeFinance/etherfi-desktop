#!/bin/bash

DIST_PATH="dist/mac"
APP_NAME="etherfi-desktop.app"
PYTHON_EXECUTABLE_PATH="Contents/build/bin/eth2deposit_proxy"
IDENTITY="Developer ID Application: Nicholas Khorasani (X8SBW73X92)"

yarn dist --x64

echo Enter THESE:
echo com.etherfi.etherfi-desktop
echo usdx-hwwf-pdbp-karx
xcrun notarytool store-credentials --apple-id "nckhorasani@icloud.com" --team-id "X8SBW73X92"

ditto -c -k --sequesterRsrc --keepParent  "$DIST_PATH/$APP_NAME" "$DIST_PATH/etherfi-desktop.zip"
echo "101"
xcrun notarytool submit "$DIST_PATH/etherfi-desktop.zip" --keychain-profile "com.etherfi.etherfi-desktop" --wait
echo "102"
stapler staple "$DIST_PATH/$APP_NAME"
echo "103"
spctl --assess -vv --type install "$DIST_PATH/$APP_NAME"
echo "104"