#!/bin/bash

DIST_PATH="dist/mac"
APP_NAME="etherfi-desktop.app"
PYTHON_EXECUTABLE_PATH="Contents/build/bin/eth2deposit_proxy"
IDENTITY="Developer ID Application: Nicholas Khorasani (X8SBW73X92)"

# if [ -z "$APP_PATH" ] || [ -z "$PYTHON_EXECUTABLE_PATH" ] || [ -z "$IDENTITY" ]; then
#   echo "Usage: ./sign-python.sh <app_path> <python_executable_path> <identity>"
#   exit 1
# fi
# codesign --deep --force --verbose --sign "$IDENTITY" "$DIST_PATH/$APP_NAME/$PYTHON_EXECUTABLE_PATH"
# codesign --deep --force --verbose --sign "$IDENTITY" "$APP_PATH/$PYTHON_EXECUTABLE_PATH"
# codesign --deep --force --verbose --options=runtime --entitlements ../../AppleSetUp/entitlements.mac.plist --sign "Developer ID Application: Nicholas Khorasani (X8SBW73X92)" "eth2deposit_proxy"
# xcrun notarytool submit "eth2deposit_proxy.zip" --keychain-profile "etherfi-desktop.python" --wait
# cd dist/mac
# codesign --deep --force --verbose --sign "Developer ID Application: Nicholas Khorasani (X8SBW73X92)" "/Users/nicholaskhorasani/Downloads/etherfi-desktop.app/Contents/build/word_lists/english.txt"

# codesign --deep --force --verbose --options=runtime --entitlements AppleSetUp/entitlements.mac.plist --sign "Developer ID Application: Nicholas Khorasani (X8SBW73X92)" "dist/mac/etherfi-desktop.app/Contents/build/bin/eth2deposit_proxy"

yarn dist --x64

# codesign --deep --force --verbose --entitlements AppleSetUp/entitlements.mac.plist --sign "Developer ID Application: Nicholas Khorasani (X8SBW73X92)" "dist/mac/etherfi-desktop.app/Contents/build/bin/eth2deposit_proxy"

# pwd etherfi-desktop.python
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