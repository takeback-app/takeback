import React from 'react'
import { Text, Pressable, ScrollView, Stack, Icon, Skeleton } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import { NewTag } from '../../../../../components/NewTag'

interface CardsComponentProps {
  isLoading?: boolean
}

const cardsItems = [
  {
    id: 0,
    title: 'Pagar',
    icon: 'card-outline',
    to: 'takebackPayment',
    bold: true
  },
  {
    id: 1,
    title: 'Ofertas',
    icon: 'cart-outline',
    comingSoon: false,
    isNew: true,
    to: 'storeProducts'
  },
  {
    id: 2,
    title: 'Indique e Ganhe',
    icon: 'megaphone-outline',
    comingSoon: false,
    isNew: false,
    to: 'referrals'
  },
  {
    id: 3,
    title: 'Sorteios',
    icon: 'gift-outline',
    comingSoon: false,
    isNew: false,
    to: 'raffles'
  },
  {
    id: 4,
    title: 'Economia',
    icon: 'rocket-outline',
    comingSoon: false,
    to: 'balanceSaved'
  },
  // {
  //   id: 5,
  //   title: 'Desconto Energia',
  //   icon: 'flash-outline',
  //   comingSoon: false,
  //   isNew: false,
  //   to: 'electricDiscount'
  // },
  {
    id: 6,
    title: 'Transferir',
    icon: 'swap-horizontal',
    to: 'transferUser'
  }
]

export function CardsComponent(props: CardsComponentProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>()

  function navigateTo(to: string) {
    navigation.navigate(to)
  }

  return (
    <Stack>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      >
        {cardsItems.map(item =>
          props.isLoading ? (
            <Skeleton key={item.id} w="20" h="20" rounded="xl" mr="2" />
          ) : (
            <Pressable
              key={item.id}
              minW="20"
              h="20"
              justifyContent="center"
              alignItems="center"
              p="2"
              mr="2"
              bgColor="white"
              rounded="xl"
              borderWidth="1"
              borderColor="#eaeaea"
              onPress={() => navigateTo(item.to)}
              isDisabled={item.comingSoon}
              _disabled={{
                bgColor: '#eaeaea'
              }}
            >
              <Icon
                as={Ionicons}
                name={item.icon}
                size="lg"
                color={item.comingSoon ? 'gray.400' : 'blue.400'}
              />
              <Text
                fontWeight={item.bold ? 'bold' : 'semibold'}
                fontSize={item.bold ? 'sm' : 'xs'}
                maxW={16}
                textAlign="center"
                color={item.comingSoon ? 'gray.400' : 'blue.400'}
                mt="1"
              >
                {item.title}
              </Text>
              {item.isNew && (
                <NewTag position="absolute" bottom="-4px" right="-4px" />
              )}
            </Pressable>
          )
        )}
      </ScrollView>
    </Stack>
  )
}
