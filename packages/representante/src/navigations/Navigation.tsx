import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

import SignIn from '../views/auth/SignIn'
import Dashboard from '../views/dashboard'

// CLIENTE
import Consumer from '../views/consumer/consumer'
import ManagerConsumer from '../views/consumer/managerConsumer'

// EMPRESA
import Company from '../views/partners/company/company'
import ManagerCompany from '../views/partners/company/managerCompany'
import Representatives from '../views/partners/representatives/representatives'
import RepresentativesDetails from '../views/partners/representatives/details'

// CASHBACKS E ORDENS DE PAGAMENTO
import PaymentOrders from '../views/cashbacks/cashbacksPaymentOrders/paymentOrders'
import PaymentOrdersDetails from '../views/cashbacks/cashbacksPaymentOrders/paymentOrderDetails'
import { CashbackWithdraw } from '../views/cashbacks/cashbacksToPay'

// MENSALIDADE
import MontlhyPayments from '../views/partners/monthlyPayments'

import Settings from '../views/settings/settings'
import Industries from '../views/settings/industries'
import Users from '../views/settings/users/users'
import { Profile } from '../views/settings/profiles'

import PaymentMethods from '../views/settings/paymentMethods'
import SupportUsers from '../views/settings/supportUsers/supportUsers'
import Plans from '../views/settings/plans'
import NotFound from '../views/notFound'
import Reports from '../views/reports/reports'
import MonthlyPaymentReport from '../views/reports/monthlyPaymentReport'
import PaymentsOrderReport from '../views/reports/paymentsOrderReport'
import CompaniesReport from '../views/reports/companiesReport/CompaniesReport'
import ResetPassword from '../views/auth/ResetPassword'
import ForgotPassword from '../views/auth/ForgotPassword'
import CashbackReport from '../views/reports/cashbackReport'
import { WithdrawOrderDetails } from '../views/cashbacks/cashbacksToPay/details'
import { Raffles } from '../views/partners/raffles'
import { RaffleDetail } from '../views/partners/raffles/RaffleDetail'
import { Bonus } from '../views/bonus'
import { BonusDetail } from '../views/bonus/BonusDetail'
import { NotificationSolicitationShow } from '../views/partners/notificationSolicitations/show'
import { NotificationSolicitationIndex } from '../views/partners/notificationSolicitations'
import { CashbacksHistoric } from '../views/cashbacks/casbacksHistoric/CasbacksHistoric'
import { CompanyDetails } from '../views/CompanyDetails'
import { CreateCompany } from '../views/CreateCompany'

interface Props {
  children: JSX.Element
}

const PrivateRoute: React.FC<React.PropsWithChildren<Props>> = ({
  children
}: Props) => {
  const { isSignedIn } = useContext(AuthContext)

  return isSignedIn ? children : <Navigate to="/" />
}

const Navigation: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/resetar-senha" element={<ResetPassword />} />
      <Route path="/recuperar-senha" element={<ForgotPassword />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/empresas"
        element={
          <PrivateRoute>
            <Company />
          </PrivateRoute>
        }
      />

      <Route
        path="/empresas/criar"
        element={
          <PrivateRoute>
            <CreateCompany />
          </PrivateRoute>
        }
      />

      <Route
        path="/empresas/:id"
        element={
          <PrivateRoute>
            <CompanyDetails />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export { Navigation }
