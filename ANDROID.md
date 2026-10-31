# Android app

The Android app uses the existing responsive Kilivo Labs site inside a native
Capacitor shell.

## Build and run

1. Install Android Studio with the Android SDK and a JDK supported by the
   installed Android Gradle Plugin.
2. Install JavaScript dependencies with `npm ci`.
3. Run `npm run android:sync` to build the site and copy it into the Android
   project.
4. Open the project with `npm run android:open`, then build or run it from
   Android Studio using an emulator or connected Android device.

To run directly from the command line, use `npm run android:run` with an
Android device or emulator available to ADB.

The debug APK is generated at
`android/app/build/outputs/apk/debug/app-debug.apk`.
