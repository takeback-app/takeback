import { AppState } from 'react-native'

export function initFocus(callback: () => void) {
  let appState = AppState.currentState

  const onAppStateChange = nextAppState => {
    /* If it's resuming from background or inactive mode to active one */
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      callback()
    }
    appState = nextAppState
  }

  // Subscribe to the app state change events
  const subscription = AppState.addEventListener('change', onAppStateChange)

  return () => {
    subscription.remove()
  }
}
