import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { PrivateRouteParam } from '../@types/routes'

const { Group, Navigator, Screen } =
  createNativeStackNavigator<PrivateRouteParam>()

import { Home } from '../screens/private/home'
import { Profile } from '../screens/private/profile'
import { ProfileData } from '../screens/private/profileData'
import { ProfileEmail } from '../screens/private/profileEmail'
import { ProfileEmailVerify } from '../screens/private/profileEmailVerify'
import { ProfilePhone } from '../screens/private/profilePhone'
import { Notifications } from '../screens/private/notifications'
import { Extract } from '../screens/private/extract'
import { PaymentValue } from '../screens/private/paymentValue'
import { PaymentCode } from '../screens/private/paymentCode'
import { TransferStart } from '../screens/private/transferStart'
import { TransferUser } from '../screens/private/transferUser'
import { TransferValue } from '../screens/private/transferValue'
import { TransferConfirmation } from '../screens/private/transferConfirmation'
import { TransferPassword } from '../screens/private/transferPassword'
import { TransferSuccess } from '../screens/private/transferSuccess'
import { RecommendationStart } from '../screens/private/recommendationStart'
import { CompanyDetails } from '../screens/private/companyDetails'
import { BalanceSaved } from '../screens/private/balanceSaved'
import { RaffleDetailStack } from '../screens/private/raffleDetail'
import { RaffleTabs } from '../screens/private/raffles/tabs'
import { PaymentStack } from '../screens/private/newPayment'
import { TransactionDetails } from '../screens/private/extractDetails/TransactionDetails'
import { TransferDetails } from '../screens/private/extractDetails/TransferDetails'
import { ElectricDiscount } from '../screens/private/electricDiscount'
import { RaffleTickets } from '../screens/private/raffleTickets'
import { TakebackPaymentStack } from '../screens/private/payment'
import { AskPassword } from '../screens/private/askPassword'
import { UpdateAccountStack } from '../screens/private/updateAccount'
import { useStorage } from '../hooks/useStorage'
import { RaffleRules } from '../screens/private/raffles/RaffleRules'
import { Referrals } from '../screens/private/consumerReferrals'
import { CreateReferral } from '../screens/private/consumerReferrals/CreateReferral'
import { StoreProductTabs } from '../screens/private/storeProducts/tabs'
import { ProductDetailStack } from '../screens/private/storeProductDetail'
import { OrderDetailStack } from '../screens/private/storeOrderDetail'

export function PrivateRoutes() {
  const { isAccountUpdated } = useStorage()

  if (!isAccountUpdated) {
    return <UpdateAccountStack />
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Screen name="home" component={Home} />
      <Group>
        <Screen name="profile" component={Profile} />
        <Screen name="profileData" component={ProfileData} />
        <Screen name="profileEmail" component={ProfileEmail} />
        <Screen name="profileEmailVerify" component={ProfileEmailVerify} />
        <Screen name="profilePhone" component={ProfilePhone} />
      </Group>
      <Screen name="notifications" component={Notifications} />
      <Screen name="companyDetails" component={CompanyDetails} />
      <Group screenOptions={{ presentation: 'modal', gestureEnabled: false }}>
        <Screen name="newPayment" component={PaymentStack} />
        <Screen name="takebackPayment" component={TakebackPaymentStack} />
        <Screen name="askPassword" component={AskPassword} />
      </Group>
      <Group>
        <Screen name="extract" component={Extract} />
      </Group>
      <Group>
        <Screen name="paymentValue" component={PaymentValue} />
        {/* <Screen name="paymentPassword" component={PaymentPassword} /> */}
        <Screen name="paymentCode" component={PaymentCode} />
      </Group>
      <Group>
        <Screen name="transferStart" component={TransferStart} />
        <Screen name="transferUser" component={TransferUser} />
        <Screen name="transferValue" component={TransferValue} />
        <Screen name="transferConfirmation" component={TransferConfirmation} />
        <Screen name="transferPassword" component={TransferPassword} />
        <Screen name="transferSuccess" component={TransferSuccess} />
      </Group>
      <Screen name="recommendationStart" component={RecommendationStart} />
      <Screen name="raffles" component={RaffleTabs} />
      <Screen name="raffleTickets" component={RaffleTickets} />
      <Group screenOptions={{ presentation: 'modal' }}>
        <Screen name="raffleRules" component={RaffleRules} />
      </Group>
      <Screen name="storeProducts" component={StoreProductTabs} />
      <Screen name="balanceSaved" component={BalanceSaved} />

      <Group screenOptions={{ presentation: 'modal' }}>
        <Screen name="raffleDetail" component={RaffleDetailStack} />
        <Screen name="productDetail" component={ProductDetailStack} />
        <Screen name="orderDetail" component={OrderDetailStack} />
        <Screen name="transactionDetails" component={TransactionDetails} />
        <Screen name="transferDetails" component={TransferDetails} />
        <Screen name="electricDiscount" component={ElectricDiscount} />
      </Group>

      <Group>
        <Screen name="referrals" component={Referrals} />
        <Screen name="createReferral" component={CreateReferral} />
      </Group>
    </Navigator>
  )
}
