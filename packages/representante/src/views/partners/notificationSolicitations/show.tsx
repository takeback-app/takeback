import React from 'react'

import useSWR from 'swr'

import { useParams } from 'react-router'
import { Flex, Stack } from '@chakra-ui/react'

import { NotificationSolicitationCard } from './components/NotificationSolicitationCard'
import Layout from '../../../components/ui/Layout'
import PrimaryLoader from '../../../components/loaders/primaryLoader'
import { NotificationSolicitation } from '.'

export interface NotificationSolicitationShow extends NotificationSolicitation {
  audienceCount: number
}

export function NotificationSolicitationShow() {
  const { id } = useParams()

  const { data, isLoading } = useSWR<NotificationSolicitationShow>(
    `manager/notification-solicitations/${id}`
  )

  if (isLoading || !data) {
    return (
      <Layout title="Saque">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PrimaryLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Criar notificação">
      <Stack overflowX="scroll" h="92vh" p={4} pb={6}>
        <NotificationSolicitationCard data={data} />
      </Stack>
    </Layout>
  )
}
