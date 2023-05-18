import React from 'react'
import {
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  ViewProps
} from 'react-native'
import { StatusBar as ExpoStatusBar, StatusBarProps } from 'expo-status-bar'

interface LayoutProps extends ViewProps {
  barProps?: StatusBarProps
}

export const Layout: React.FC<LayoutProps> = ({ children, ...rest }) => {
  return (
    <>
      <ExpoStatusBar style="dark" {...rest.barProps} />
      <SafeAreaView style={styles.safeArea} {...rest}>
        {children}
      </SafeAreaView>
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
