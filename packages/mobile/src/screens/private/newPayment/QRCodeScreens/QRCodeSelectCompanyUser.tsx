import { FlashList } from '@shopify/flash-list'
import {
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
  View,
  useToast
} from 'native-base'
import React, { useMemo, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ModalHeader } from '../../../../components/header/ModalHeader'
import { Layout } from '../../../../components/layout'
import { usePaymentStore } from '../state'
import { CompanyUserItem } from '../components/CompanyUserItem'
import { ToastAlert } from '../../../../components/ToastAlert'
import { createQRCodeLink } from '../../../../services'

export function QRCodeSelectCompanyUser({ navigation }) {
  const toast = useToast()

  const { qrCodeLink, company, reset } = usePaymentStore()

  const [search, setSearch] = useState('')
  const [isSearchInputFocus, setIsSearchInputFocus] = useState(false)

  const filteredUsers = useMemo(() => {
    const companyUsers = [{ id: '', name: 'Não sei' }, ...company.companyUsers]

    return companyUsers.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [company, search])

  const { bottom: bottomHeight } = useSafeAreaInsets()

  async function createQRCode(companyUserId?: string) {
    if (!qrCodeLink) return

    const [isOk, response] = await createQRCodeLink({
      link: qrCodeLink,
      companyUserId: companyUserId || undefined,
      companyId: company.id
    })

    toast.show({
      render: () => (
        <ToastAlert
          status={isOk ? 'success' : 'error'}
          title={isOk ? 'Sucesso!' : 'Erro!'}
          variant="left-accent"
          description={response.message}
        />
      ),
      duration: 3000
    })

    navigation.popToTop()
    navigation.goBack(null)

    reset()
  }

  return (
    <Layout withoutKeyboardDismiss>
      <ModalHeader onPress={navigation.goBack} title="" type="back" />

      <Flex px={4} mt={2}>
        <Flex display={isSearchInputFocus ? 'none' : 'flex'}>
          <Heading fontSize="26" fontWeight="semibold">
            Quem foi o funcionário da empresa que te atendeu?
          </Heading>
          <Text color="gray.600" fontSize="md" mt="3">
            Funcionários de {company.fantasyName.toUpperCase()}
          </Text>
        </Flex>

        <Flex mt={isSearchInputFocus ? 4 : 8} mb={8}>
          <FormControl>
            <FormControl.Label display={isSearchInputFocus ? 'flex' : 'none'}>
              <Text fontWeight="semibold" color="gray.600">
                Nome do funcionário
              </Text>
            </FormControl.Label>
            <Input
              variant="underlined"
              fontSize="lg"
              keyboardAppearance="light"
              onFocus={() => setIsSearchInputFocus(true)}
              onBlur={() => setIsSearchInputFocus(false)}
              fontWeight="semibold"
              placeholder={isSearchInputFocus ? '' : 'Nome do funcionário'}
              placeholderTextColor="#BBB"
              colorScheme="blue"
              borderBottomWidth="2"
              value={search}
              onChangeText={setSearch}
              borderBottomColor="#EEE"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              _input={{
                selectionColor: '#449FE7',
                cursorColor: '#449FE7',
                pb: '10px'
              }}
            />
          </FormControl>
        </Flex>
      </Flex>
      <Flex pb={bottomHeight} flex={1} mt="4">
        <Text ml={4} mb={2} fontWeight="semibold" color="gray.600">
          {!!search ? 'Resultados' : 'Todos funcionários da empresa'}
        </Text>
        <FlashList
          data={filteredUsers}
          estimatedItemSize={140}
          renderItem={({ item }) => (
            <CompanyUserItem onPress={createQRCode} companyUser={item} />
          )}
          ItemSeparatorComponent={() => (
            <View borderBottomWidth="1" borderColor="gray.400" />
          )}
        />
      </Flex>
    </Layout>
  )
}
