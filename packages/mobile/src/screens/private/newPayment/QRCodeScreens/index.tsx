import React, { useEffect, useState } from 'react'

import { CameraView, Camera } from "expo-camera/next";

import { Card, Center, Heading, Stack, Text } from 'native-base'
import { Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Illustration from '../../../../assets/undraw_access_denied_re_awnf.svg'
import { Button } from '../../../../components/Button'
import { ModalHeader } from '../../../../components/header/ModalHeader'
import { Layout } from '../../../../components/layout'
import { usePaymentStore } from '../state'

export function QRCode({ navigation }) {
  const { bottom } = useSafeAreaInsets()
  const { setQRCodeLink } = usePaymentStore()

  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    }

    getCameraPermissions()
  }, [])

  const handleBarCodeScanned = async ({ data }) => {
    setQRCodeLink(data)
    setScanned(true);
    navigation.navigate('qrCodeSelectCompanyUser')
  };

  return (
    <Layout withoutKeyboardDismiss>
      <ModalHeader title="Leitor de QR Code" onPress={navigation.goBack} />

      {hasPermission ? (
        <>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417"],
            }}
            style={{ flex: 1 }}
          />
          <Card>
            <Text fontWeight="medium" textAlign="center">
              Leia o <Text color="blue.700">QR Code</Text> da sua nota fiscal
              para fazer o lançamento automático dos valores
            </Text>
          </Card>
        </>
      ) : (
        <Stack flex="1" mb={bottom} px="4" space="8" justifyContent="center">
          <Center>
            <Illustration width={256} height={246} style={{ marginTop: -96 }} />
            <Heading
              fontSize="xl"
              color="gray.800"
              fontWeight="bold"
              textAlign="center"
              mt="8"
            >
              Sem permissão para câmera
            </Heading>
            <Text
              textAlign="center"
              color="gray.600"
              fontWeight="medium"
              mt="2"
            >
              Precisamos do acesso a sua câmera para conseguir ler o QR Code da
              usa notinha.
            </Text>
          </Center>
          <Button onPress={() => Linking.openURL('app-settings:')}>
            Dar permissão
          </Button>
        </Stack>
      )}
    </Layout>
  )
}
