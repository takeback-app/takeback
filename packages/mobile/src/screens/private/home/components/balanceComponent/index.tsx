import React, { useContext } from 'react'
import { View } from 'react-native'
import {
  Box,
  HStack,
  VStack,
  Text,
  Stack,
  Pressable,
  Icon,
  Skeleton,
  useDisclose
} from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

import { PrivateRouteParam } from '../../../../../@types/routes'
import { maskCurrency } from '../../../../../utils/masks'
import TakebackLogo from '../../../../../assets/takeback.svg'
import { UserDataContext } from '../../../../../contexts/UserDataContext'
import moment from 'moment'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ExpireBalanceInfoModal } from '../../../../../components/ExpireBalanceInfoModal'

interface BalanceComponentProps {
  balance?: number
  isLoading?: boolean
}

export const BalanceComponent: React.FC<BalanceComponentProps> = props => {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  const { isOpen, onClose, onOpen } = useDisclose()

  const { balanceExpireDate } = useContext(UserDataContext)

  const [visible, setVisible] = React.useState(true)

  function navigateToExtract() {
    navigation.navigate('extract')
  }

  if (props.isLoading) {
    return (
      <VStack w="full" p="4" rounded="xl" bgColor="blue.400" space="8">
        <HStack alignItems="center" space="2">
          <Skeleton w="6" h="6" rounded="full" startColor="blue.300" />
          <Skeleton w="32" h="4" rounded="full" startColor="blue.300" />
        </HStack>

        <VStack space="1">
          <Skeleton w="24" h="3" startColor="blue.300" rounded="full" />
          <Skeleton w="32" h="8" startColor="blue.300" rounded="2xl" />
        </VStack>
      </VStack>
    )
  }

  return (
    <>
      <VStack w="full" p="4" rounded="xl" bgColor="blue.400">
        <HStack justifyContent="space-between" alignItems="center">
          <HStack space="2">
            <Box w="6" h="6" p="1" rounded="md" bgColor="blue.300">
              <TakebackLogo />
            </Box>
            <Text fontWeight="semibold" fontSize="md" color="white">
              Takeback
            </Text>
          </HStack>
          <View>
            <Pressable onPress={() => setVisible(!visible)}>
              <Icon
                as={Ionicons}
                name={visible ? 'eye-outline' : 'eye-off-outline'}
                size="xl"
                color="white"
              />
            </Pressable>
          </View>
        </HStack>
        <HStack justifyContent="space-between" alignItems="flex-end" mt="2">
          <View>
            <Text fontWeight="semibold" fontSize="md" color="white">
              Saldo disponível
            </Text>
            {balanceExpireDate ? (
              <HStack direction="row" space={1} alignItems="center">
                <Text fontWeight="normal" fontSize="xs" color="white">
                  Expira em: {moment(balanceExpireDate).format('DD/MM/YYYY')}
                </Text>
                <TouchableOpacity onPress={onOpen} style={{ padding: 2 }}>
                  <MaterialCommunityIcons
                    name="information"
                    size={16}
                    color="white"
                  />
                </TouchableOpacity>
              </HStack>
            ) : null}

            <Stack
              bgColor={visible ? 'blue.400' : 'blue.300'}
              mt={1}
              rounded="md"
            >
              <Text
                fontWeight="medium"
                fontSize="3xl"
                color={visible ? 'white' : 'blue.300'}
                lineHeight="sm"
              >
                {maskCurrency(props.balance || 0)}
              </Text>
            </Stack>
          </View>

          <Pressable
            flexDir="row"
            alignItems="center"
            px="4"
            py="2"
            bgColor="white"
            rounded="md"
            onPress={navigateToExtract}
          >
            <Text fontWeight="medium" fontSize="sm" color="blue.400">
              Extrato
            </Text>
            <Icon
              as={Ionicons}
              name="ios-chevron-forward"
              size="sm"
              color="blue.400"
            />
          </Pressable>
        </HStack>
      </VStack>

      <ExpireBalanceInfoModal
        isOpen={isOpen}
        onPress={onClose}
        onClose={onClose}
      />
    </>
  )
}
