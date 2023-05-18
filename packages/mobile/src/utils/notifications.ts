import { Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications')

    return
  }

  const status = await requestNotificationPermission()

  if (status !== 'granted') {
    return
  }

  const expoPushToken = await Notifications.getExpoPushTokenAsync()

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  return expoPushToken.data
}

async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync()

  if (status === 'granted') return status

  const { status: newStatus } = await Notifications.requestPermissionsAsync()

  return newStatus
}
