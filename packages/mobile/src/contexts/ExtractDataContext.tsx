import React, { useState, createContext, Dispatch, SetStateAction } from 'react'
import { ExtractTransactionTypes } from '../types/responseApi/ExtractTransactionTypes'

interface IProps {
  extractData: ExtractTransactionTypes
  setExtractData: Dispatch<SetStateAction<ExtractTransactionTypes>>
}

interface ExtractDataProvider {
  children: JSX.Element | JSX.Element[]
}

export const ExtractDataContext = createContext<IProps>({
  extractData: {} as ExtractTransactionTypes,
  setExtractData: () => null
})

const ExtractDataProvider: React.FC<ExtractDataProvider> = ({ children }) => {
  const [extractData, setExtractData] = useState({} as ExtractTransactionTypes)

  return (
    <ExtractDataContext.Provider
      value={{
        extractData,
        setExtractData
      }}
    >
      {children}
    </ExtractDataContext.Provider>
  )
}

export default ExtractDataProvider
