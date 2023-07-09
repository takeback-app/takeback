import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthContext } from '../contexts/AuthContext'
import { PrivacyPolicy } from '../pages/public/privacyPolicy' // Mudei o nome do compornente PrivacyPolicy para TermsOfUse
import { ForgotPassword } from '../pages/public/forgotPassword'
import { ResetPassword } from '../pages/public/resetPassword'
import { SignIn } from '../pages/public/signIn'
import { SignUp } from '../pages/public/signUp'
import { Cashback } from '../pages/private/cashbacksPay'
import { Dashboard } from '../pages/private/dashboard'
import { NotFound } from '../pages/public/notFound'
import { PaymentMethods } from '../pages/private/settingsMethods'
import { Users } from '../pages/private/settingsUsers'
import { Company } from '../pages/private/settingsData'
import { PaymentOrders } from '../pages/private/cashbacksOrders'
import { CashbackHistoric } from '../pages/private/cashbacksHistoric'
import { PaymentOrderDetails } from '../pages/private/cashbacksOrdersDetails'
import { Profile } from '../pages/private/settingsProfile'
import { CashbacksToReceive } from '../pages/private/cashbacksReceive'
import { MonthlyPayments } from '../pages/private/monthlyPayments'
import { WithDrawPage } from '../pages/private/withDraw'
import { CashRegister } from '../pages/private/cashRegister'
import { SolicitationType, Solicitations } from '../pages/private/solicitations'
import { Raffles } from '../pages/private/raffles'
import { RaffleCreate } from '../pages/private/raffles/raffleCreate'
import { RaffleDetails } from '../pages/private/raffles/raffleDetails'
import { ClientReport } from '../pages/private/reports/client'
import { CashRegisterCheck } from '../pages/private/cashRegisterCheck'
import { CompanyUserReport } from '../pages/private/reports/companyUser'
import { CashbackReport } from '../pages/private/reports/cashback'
import { Notifications } from '../pages/private/createNotifications'
import { NotificationCreate } from '../pages/private/createNotifications/createNotification'
import { BirthdayNotificationCreate } from '../pages/private/birthdayNotification'
import { LogoChangeRequest } from '../pages/private/logoChangeRequest'
import { TakebackPayments } from '../pages/private/takebackPayments'

interface Props {
  children: JSX.Element
}

const PrivateRoute: React.FC<Props> = ({ children }: Props) => {
  const { isSignedIn } = useContext(AuthContext)

  return isSignedIn ? children : <Navigate to="/" />
}

const Navigation: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/cadastrar-se" element={<SignUp />} />
      <Route path="/recuperar-senha" element={<ForgotPassword />} />
      <Route path="/resetar-senha" element={<ResetPassword />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />

      <Route
        path="/painel"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/solicitações/pagamento"
        element={
          <PrivateRoute>
            <Solicitations type={SolicitationType.PAYMENT} />
          </PrivateRoute>
        }
      />
      <Route
        path="/solicitações/cashback"
        element={
          <PrivateRoute>
            <Solicitations type={SolicitationType.CASHBACK} />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashbacks/pendentes"
        element={
          <PrivateRoute>
            <Cashback />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashbacks/receber"
        element={
          <PrivateRoute>
            <CashbacksToReceive />
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
        path="/cashbacks/pagamentos/:index"
        element={
          <PrivateRoute>
            <PaymentOrderDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashbacks/historico"
        element={
          <PrivateRoute>
            <CashbackHistoric />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashbacks/saque"
        element={
          <PrivateRoute>
            <WithDrawPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/caixa"
        element={
          <PrivateRoute>
            <CashRegister />
          </PrivateRoute>
        }
      />
      <Route
        path="/caixa/check"
        element={
          <PrivateRoute>
            <CashRegisterCheck />
          </PrivateRoute>
        }
      />

      <Route
        path="/sorteios"
        element={
          <PrivateRoute>
            <Raffles />
          </PrivateRoute>
        }
      />

      <Route
        path="/sorteios/create"
        element={
          <PrivateRoute>
            <RaffleCreate />
          </PrivateRoute>
        }
      />

      <Route
        path="/sorteios/:id"
        element={
          <PrivateRoute>
            <RaffleDetails />
          </PrivateRoute>
        }
      />

      <Route
        path="/sorteios/:id/edit"
        element={
          <PrivateRoute>
            <RaffleDetails type="edit" />
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
        path="/notificacoes/aniversario"
        element={
          <PrivateRoute>
            <BirthdayNotificationCreate />
          </PrivateRoute>
        }
      />

      <Route
        path="/notificacoes/create"
        element={
          <PrivateRoute>
            <NotificationCreate />
          </PrivateRoute>
        }
      />

      <Route
        path="/marketing"
        element={
          <PrivateRoute>
            <MonthlyPayments />
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
        path="/configuracoes/pagamento"
        element={
          <PrivateRoute>
            <PaymentMethods />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracoes/empresa"
        element={
          <PrivateRoute>
            <Company />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracoes/trocar-logo"
        element={
          <PrivateRoute>
            <LogoChangeRequest />
          </PrivateRoute>
        }
      />

      <Route
        path="/configuracoes/perfil"
        element={
          <PrivateRoute>
            <Profile />
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
            <CompanyUserReport />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export { Navigation }
