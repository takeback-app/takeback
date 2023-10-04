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

// CASHBACKS E ORDENS DE PAGAMENTO
import PaymentOrders from '../views/cashbacks/cashbacksPaymentOrders/paymentOrders'
import PaymentOrdersDetails from '../views/cashbacks/cashbacksPaymentOrders/paymentOrderDetails'
import { CashbackWithdraw } from '../views/cashbacks/cashbacksToPay'

// MENSALIDADE
import MontlhyPayments from '../views/partners/monthlyPayments'

import Settings from '../views/settings/settings'
import Industries from '../views/settings/industries'
import Users from '../views/settings/users/users'
import PaymentMethods from '../views/settings/paymentMethods'
import Plans from '../views/settings/plans'
import NotFound from '../views/notFound'
import ResetPassword from '../views/auth/ResetPassword'
import ForgotPassword from '../views/auth/ForgotPassword'
import { WithdrawOrderDetails } from '../views/cashbacks/cashbacksToPay/details'
import { Raffles } from '../views/partners/raffles'
import { RaffleDetail } from '../views/partners/raffles/RaffleDetail'
import { Bonus } from '../views/bonus'
import { BonusDetail } from '../views/bonus/BonusDetail'
import { NotificationSolicitationShow } from '../views/partners/notificationSolicitations/show'
import { NotificationSolicitationIndex } from '../views/partners/notificationSolicitations'
import { CashbacksHistoric } from '../views/cashbacks/casbacksHistoric/CasbacksHistoric'
import { Representatives } from '../views/partners/representatives'
import { EditRepresentative } from '../views/partners/representatives/edit'
import { CreateRepresentative } from '../views/partners/representatives/create'
import { LogoChangeRequest } from '../views/partners/logoChangeRequest'
import { Notifications } from '../views/notifications'
import { StoreProductsList } from '../views/store'
import { CreateStoreProduct } from '../views/store/create'
import { StoreProductDetail } from '../views/store/show'
import { ClientReport } from '../views/reports/client'
import { SellerReport } from '../views/reports/seller'
import { CashbackReport } from '../views/reports/cashback'
import { CompanyReport } from '../views/reports/company'
import { FinancialReport } from '../views/reports/financial'
import { Transfers } from '../views/consumer/transfers/transfers'

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
        path="/usuarios/clientes"
        element={
          <PrivateRoute>
            <Consumer />
          </PrivateRoute>
        }
      />
      <Route
        path="/bonus"
        element={
          <PrivateRoute>
            <Bonus />
          </PrivateRoute>
        }
      />
      <Route
        path="/bonus/:id"
        element={
          <PrivateRoute>
            <BonusDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/notificacoes"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios/clientes/:id"
        element={
          <PrivateRoute>
            <ManagerConsumer />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashbacks/historico"
        element={
          <PrivateRoute>
            <CashbacksHistoric />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashbacks/pagamentos"
        element={
          <PrivateRoute>
            <PaymentOrders />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashbacks/pagamentos/:id"
        element={
          <PrivateRoute>
            <PaymentOrdersDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashbacks/saque"
        element={
          <PrivateRoute>
            <CashbackWithdraw />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashbacks/saque/:id"
        element={
          <PrivateRoute>
            <WithdrawOrderDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros/empresa"
        element={
          <PrivateRoute>
            <Company />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros/empresa/:id"
        element={
          <PrivateRoute>
            <ManagerCompany />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros/troca-logo"
        element={
          <PrivateRoute>
            <LogoChangeRequest />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros/sorteios"
        element={
          <PrivateRoute>
            <Raffles />
          </PrivateRoute>
        }
      />

      <Route
        path="/parceiros/sorteios/:id"
        element={
          <PrivateRoute>
            <RaffleDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros/notification-solicitations"
        element={
          <PrivateRoute>
            <NotificationSolicitationIndex />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros/notification-solicitations/:id"
        element={
          <PrivateRoute>
            <NotificationSolicitationShow />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros/mensalidades"
        element={
          <PrivateRoute>
            <MontlhyPayments />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros/representantes"
        element={
          <PrivateRoute>
            <Representatives />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros/representantes/criar"
        element={
          <PrivateRoute>
            <CreateRepresentative />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros/representantes/:id"
        element={
          <PrivateRoute>
            <EditRepresentative />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracoes"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracoes/ramos-de-atividade"
        element={
          <PrivateRoute>
            <Industries />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracoes/usuarios"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracoes/metodos-de-pagamento"
        element={
          <PrivateRoute>
            <PaymentMethods />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracoes/planos-e-mensalidade"
        element={
          <PrivateRoute>
            <Plans />
          </PrivateRoute>
        }
      />

      <Route
        path="/ofertas"
        element={
          <PrivateRoute>
            <StoreProductsList />
          </PrivateRoute>
        }
      />

      <Route
        path="/ofertas/criar"
        element={
          <PrivateRoute>
            <CreateStoreProduct />
          </PrivateRoute>
        }
      />
      <Route
        path="/ofertas/:id"
        element={
          <PrivateRoute>
            <StoreProductDetail />
          </PrivateRoute>
        }
      />

      <Route
        path="/relatorios/cliente"
        element={
          <PrivateRoute>
            <ClientReport />
          </PrivateRoute>
        }
      />
      <Route
        path="/relatorios/venda"
        element={
          <PrivateRoute>
            <SellerReport />
          </PrivateRoute>
        }
      />
      <Route
        path="/relatorios/cashback"
        element={
          <PrivateRoute>
            <CashbackReport />
          </PrivateRoute>
        }
      />
      <Route
        path="/relatorios/empresas"
        element={
          <PrivateRoute>
            <CompanyReport />
          </PrivateRoute>
        }
      />
      <Route
        path="/relatorios/financeiro"
        element={
          <PrivateRoute>
            <FinancialReport />
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios/transferencias"
        element={
          <PrivateRoute>
            <Transfers />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export { Navigation }
