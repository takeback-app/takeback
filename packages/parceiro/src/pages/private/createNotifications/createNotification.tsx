import React from 'react'

import { Stack } from '@chakra-ui/react'
import { Layout } from '../../../components/ui/layout'
import { GenerateAudienceCard } from './components/GenerateAudienceCard'
import { NotificationDataCard } from './components/NotificationDataCard'

export function NotificationCreate() {
  return (
    <Layout title="Criar notificação">
      <Stack overflowX="scroll" h="92vh" p={4} pb={6}>
        <GenerateAudienceCard />
        <NotificationDataCard />
      </Stack>
    </Layout>
  )
}
