import React from 'react'
import {
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  ViewProps,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import { StatusBar as ExpoStatusBar, StatusBarProps } from 'expo-status-bar'

interface LayoutProps extends ViewProps {
  withoutKeyboardDismiss?: boolean
  barProps?: StatusBarProps
}

export function Layout({
  children,
  withoutKeyboardDismiss = false,
  ...rest
}: LayoutProps) {
  if (withoutKeyboardDismiss) {
    return (
      <>
        <ExpoStatusBar style="dark" {...rest.barProps} />
        <SafeAreaView style={styles.safeArea} {...rest}>
          {children}
        </SafeAreaView>
      </>
    )
  }

  return (
    <>
      <ExpoStatusBar style="dark" {...rest.barProps} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea} {...rest}>
          {children}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: RNStatusBar.currentHeight
  }
})
