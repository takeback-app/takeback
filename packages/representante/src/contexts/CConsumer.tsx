import React, { useState, createContext, SetStateAction, Dispatch } from 'react'
import { TConsumer } from '../types/TConsumer'
import { TConsumersToFilter } from '../types/TConsumersToFilter'

interface IConsumer {
  consumers: TConsumer[]
  setConsumers: Dispatch<SetStateAction<TConsumer[]>>

  offsetConsumers: number
  setOffsetConsumers: Dispatch<SetStateAction<number>>

  endListConsumers: boolean
  setEndListConsumers: Dispatch<SetStateAction<boolean>>

  consumer: TConsumer
  setConsumer: Dispatch<SetStateAction<TConsumer>>

  consumersToFilter: TConsumersToFilter[]
  setConsumersToFilter: Dispatch<SetStateAction<TConsumersToFilter[]>>
}

export const CConsumer = createContext<IConsumer>({
  consumers: [{} as TConsumer],
  setConsumers: () => null,

  offsetConsumers: 1,
  setOffsetConsumers: () => null,

  endListConsumers: false,
  setEndListConsumers: () => null,

  consumer: {} as TConsumer,
  setConsumer: () => null,

  consumersToFilter: [{} as TConsumersToFilter],
  setConsumersToFilter: () => null
})

const ConsumerProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const [consumers, setConsumers] = useState([] as Array<TConsumer>)
  const [consumersToFilter, setConsumersToFilter] = useState(
    [] as Array<TConsumersToFilter>
  )
  const [consumer, setConsumer] = useState<TConsumer>({} as TConsumer)

  const [offsetConsumers, setOffsetConsumers] = useState(1)
  const [endListConsumers, setEndListConsumers] = useState(false)

  return (
    <CConsumer.Provider
      value={{
        consumers,
        setConsumers,
        offsetConsumers,
        setOffsetConsumers,
        endListConsumers,
        setEndListConsumers,
        consumer,
        setConsumer,
        consumersToFilter,
        setConsumersToFilter
      }}
    >
      {children}
    </CConsumer.Provider>
  )
}

export default ConsumerProvider
