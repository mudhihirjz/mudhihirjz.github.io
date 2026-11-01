# Android app

The Android app is a native Java application. Its screens, product cards,
navigation, and contact form are built with Android views; it does not load the
website or require an internet connection.

## Build and run

1. Install Android Studio with the Android SDK and JDK 21.
2. Open the `android` directory in Android Studio and run the app on a device
   or emulator.
3. Or build a debug APK with `npm run android:build`.
4. With a connected device or running emulator, install it with
   `npm run android:install`.

The debug APK is generated at
`android/app/build/outputs/apk/debug/app-debug.apk`.

The contact form is a local demo and does not send or store messages. Product
systems and Google Play downloads are shown as planned/not yet available.
