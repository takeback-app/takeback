import React from 'react'

import {
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Radio,
  SimpleGrid,
  Text
} from '@chakra-ui/react'

import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { ChakraRadio } from '../../../../components/chakra/ChakraRatio'
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'
import { currencyFormat } from '../../../../utils/currencytFormat'
import moment from 'moment'
import { NotificationSolicitationShow } from '../show'
import { NotificationSolicitationStatus } from '..'
import { ApproveButton } from './ApproveButton'
import { ReproveButton } from './ReproveButton'

interface NotificationSolicitationProps {
  data: NotificationSolicitationShow
}

export function NotificationSolicitationCard({
  data
}: NotificationSolicitationProps) {
  return (
    <Card>
      <CardHeader>
        <Heading fontSize="md">Gerar Público</Heading>
      </CardHeader>
      <Divider borderColor="gray.300" />
      <CardBody>
        <SimpleGrid columns={{ base: 1, lg: 2, xl: 2, '2xl': 4 }} gap={8}>
          <ChakraRadio
            isReadOnly
            isRequired
            label="Sexo"
            value={data.audienceSex}
          >
            <Radio value="MALE">Masculino</Radio>
            <Radio value="FEMALE">Feminino</Radio>
            <Radio value="ALL">Ambos</Radio>
          </ChakraRadio>

          <ChakraRadio
            isReadOnly
            label="Tem filhos?"
            isRequired
            value={
              data.hasChildren
                ? 'yes'
                : data.hasChildren === false
                ? 'no'
                : 'both'
            }
          >
            <Radio value="yes">Sim</Radio>
            <Radio value="no">Não</Radio>
            <Radio value="both">Ambos</Radio>
          </ChakraRadio>

          <FormControl isReadOnly>
            <Flex mb={2} align="center">
              <FormLabel
                mb={0}
                fontSize="xs"
                fontWeight="semibold"
                color="gray.600"
              >
                Idade
              </FormLabel>
              <Checkbox
                isChecked={!data.minAudienceAge && !data.maxAudienceAge}
                isReadOnly
                size="sm"
                fontSize="xs"
                fontWeight="semibold"
                color="gray.600"
              >
                Todas as idades
              </Checkbox>
            </Flex>
            <HStack>
              <NumberInput
                value={data.minAudienceAge ?? undefined}
                size="sm"
                isReadOnly
                step={1}
                min={13}
                max={130}
              >
                <NumberInputField placeholder="de" />
              </NumberInput>
              <NumberInput
                value={data.maxAudienceAge ?? undefined}
                size="sm"
                isReadOnly
                step={1}
                min={13}
                max={130}
              >
                <NumberInputField placeholder="até" />
              </NumberInput>
            </HStack>
          </FormControl>

          <FormControl isReadOnly>
            <Flex mb={2} align="center">
              <FormLabel
                mb={0}
                fontSize="xs"
                fontWeight="semibold"
                color="gray.600"
              >
                Saldo Takeback acima de:
              </FormLabel>
              <Checkbox
                isReadOnly
                isChecked={!data.audienceBalance}
                size="sm"
                fontSize="xs"
                fontWeight="semibold"
                color="gray.600"
              >
                Qualquer Saldo
              </Checkbox>
            </Flex>
            <Input
              isReadOnly
              value={
                data.audienceBalance
                  ? currencyFormat(parseFloat(data.audienceBalance))
                  : undefined
              }
              size="sm"
              placeholder="R$"
              step={1}
            />
          </FormControl>

          <ChakraSelect
            isRequired
            isReadOnly
            label="Visitas na minha loja"
            value={data.storeVisitType}
            size="sm"
            options={[
              { text: 'Nunca comprou na minha loja', value: 'NEVER' },
              {
                text: 'Última compra até o dia:',
                value: 'FROM_THE_DATE_OF_PURCHASE'
              },
              { text: 'Todos os clientes', value: 'ALL' }
            ]}
          />

          <ChakraInput
            isReadOnly
            value={
              data.dateOfPurchase
                ? moment(data.dateOfPurchase).format('yyyy-MM-dd')
                : undefined
            }
            label="Última compra até o dia:"
            type="date"
            size="sm"
          />

          <ChakraInput label="Titulo" value={data.title} isReadOnly size="sm" />

          <ChakraInput
            isReadOnly
            value={data.message}
            label="Mensagem"
            placeholder="Digite a mensagem que será enviada para os usuários."
            max={100}
            size="sm"
          />
        </SimpleGrid>
      </CardBody>
      <CardFooter gap={2} flexDirection={{ base: 'column', sm: 'row' }}>
        <Text color="gray.600" fontWeight="semibold">
          Quantidade de clientes afetados: {data.audienceCount}
        </Text>
        <ButtonGroup
          ml="auto"
          isDisabled={data.status !== NotificationSolicitationStatus.CREATED}
        >
          <ApproveButton id={data.id} />
          <ReproveButton id={data.id} />
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
