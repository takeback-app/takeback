import React, { useState, createContext, SetStateAction, Dispatch } from 'react'
import { TCompaniesToFilter } from '../types/TCompaniesToFilter'
import { TCompany } from '../types/TCompany'
import { TCompanyStatus } from '../types/TCompanyStatus'
import { TCompanyUsers } from '../types/TCompanyUsers'
import { TIndustry } from '../types/TIndustry'
import { TRepresentative } from '../types/TRepresentative'

interface ICompany {
  companies: TCompany[]
  setCompanies: Dispatch<SetStateAction<TCompany[]>>

  offSetCompanies: number
  setOffSetCompanies: Dispatch<SetStateAction<number>>

  endListCompanies: boolean
  setEndListCompanies: Dispatch<SetStateAction<boolean>>

  company: TCompany
  setCompany: Dispatch<SetStateAction<TCompany>>

  companiesToFilter: TCompaniesToFilter[]
  setCompaniesToFilter: Dispatch<SetStateAction<TCompaniesToFilter[]>>

  companyUsers: TCompanyUsers[]
  setCompanyUsers: Dispatch<SetStateAction<TCompanyUsers[]>>

  companyStatus: TCompanyStatus[]
  setCompanyStatus: Dispatch<SetStateAction<TCompanyStatus[]>>

  industry: TIndustry[]
  setIndustry: Dispatch<SetStateAction<TIndustry[]>>

  representatives: TRepresentative[]
  setRepresentatives: Dispatch<SetStateAction<TRepresentative[]>>
}

export const CCompany = createContext<ICompany>({
  companies: [{} as TCompany],
  setCompanies: () => null,

  offSetCompanies: 1,
  setOffSetCompanies: () => null,

  companiesToFilter: [{} as TCompaniesToFilter],
  setCompaniesToFilter: () => null,

  endListCompanies: false,
  setEndListCompanies: () => null,

  company: {} as TCompany,
  setCompany: () => null,

  companyUsers: [{} as TCompanyUsers],
  setCompanyUsers: () => null,

  companyStatus: [{} as TCompanyStatus],
  setCompanyStatus: () => null,

  industry: [{} as TIndustry],
  setIndustry: () => null,

  representatives: [{} as TRepresentative],
  setRepresentatives: () => null
})

const CompanyProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const [companies, setCompanies] = useState([] as Array<TCompany>)
  const [companiesToFilter, setCompaniesToFilter] = useState(
    [] as Array<TCompaniesToFilter>
  )
  const [company, setCompany] = useState<TCompany>({} as TCompany)
  const [companyUsers, setCompanyUsers] = useState([] as Array<TCompanyUsers>)
  const [companyStatus, setCompanyStatus] = useState(
    [] as Array<TCompanyStatus>
  )
  const [industry, setIndustry] = useState([] as Array<TIndustry>)
  const [offSetCompanies, setOffSetCompanies] = useState(1)
  const [endListCompanies, setEndListCompanies] = useState(false)
  const [representatives, setRepresentatives] = useState(
    [] as Array<TRepresentative>
  )

  return (
    <CCompany.Provider
      value={{
        companies,
        setCompanies,
        companiesToFilter,
        setCompaniesToFilter,
        offSetCompanies,
        setOffSetCompanies,
        endListCompanies,
        setEndListCompanies,
        company,
        setCompany,
        companyUsers,
        setCompanyUsers,
        companyStatus,
        setCompanyStatus,
        industry,
        setIndustry,
        representatives,
        setRepresentatives
      }}
    >
      {children}
    </CCompany.Provider>
  )
}

export default CompanyProvider
