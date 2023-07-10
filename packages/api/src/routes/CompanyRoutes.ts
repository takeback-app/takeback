import { Router } from 'express'

import multer from 'multer'
import { DecodeTokenMiddleware } from '../middlewares/DecodeTokenMiddleware'
import { AuthCompanyMiddleware } from '../middlewares/AuthCompanyMiddleware'
import { VerifyIfIsAuthorizedToEmitCashbacks } from '../middlewares/VerifyIfIsAuthorizedToEmitCashbacks'

import { AuthCompanyController } from '../controllers/company/companyAuth/AuthCompanyController'
import { ReportsController } from '../controllers/company/companyReports/ReportsController'
import { CashbackController } from '../controllers/company/companyCashback/CashbackController'
import { PaymentMethodsController } from '../controllers/company/companyMethods/PaymentMethodsController'
import { CompanyUserController } from '../controllers/company/companyUser/CompanyUserController'
import { CompanyDataController } from '../controllers/company/companyData/CompanyDataController'
import { PaymentOrderController } from '../controllers/company/companyPaymentOrder/PaymentOrderController'
import { CompanySupportController } from '../controllers/company/companySupport/CompanySupportController'
import { CompanyMontlhyController } from '../controllers/company/companyMonthly/CompanyMonthlyController'
import { CompanyStatusController } from '../controllers/company/companyStatus/CompanyStatusController'
import { WithDrawController } from '../controllers/company/withdraw/WithDrawController'
import { RaffleController } from '../controllers/company/raffle/RaffleController'
import { FileController } from '../controllers/company/FileController'
import { RaffleItemController } from '../controllers/company/raffle/RaffleItemController'
import { SolicitationController } from '../controllers/company/SolicitationControlle'
import { CashConferenceController } from '../controllers/company/CashConferenceController'
import { NotificationSolicitationController } from '../controllers/company/NotificationSolicitationController'
import { ClientReportController } from '../controllers/company/reports/ClientReportController'
import { CompanyUserReportController } from '../controllers/company/reports/CompanyUserReportController'
import { CashbackReportController } from '../controllers/company/reports/CashbackReportController'
import { BirthdayNotificationController } from '../controllers/company/BirthdayNotificationController'
import { TransactionStatusController } from '../controllers/company/TransactionStatusController'
import { CompanyUserTypeController } from '../controllers/company/CompanyUserTypeController'
import { CompanyPaymentMethodController } from '../controllers/company/CompanyPaymentMethodController'
import { LogoChangeRequestController } from '../controllers/company/logoChangeRequest/LogoChangeRequestController'

const auth = new AuthCompanyController()
const reports = new ReportsController()
const cashback = new CashbackController()
const paymentMethod = new PaymentMethodsController()
const companyUser = new CompanyUserController()
const companyData = new CompanyDataController()
const paymentOrder = new PaymentOrderController()
const companySupport = new CompanySupportController()
const companyMontlhy = new CompanyMontlhyController()
const companyStatus = new CompanyStatusController()

const notificationSolicitationController =
  new NotificationSolicitationController()

const withDrawController = new WithDrawController()

const raffleController = new RaffleController()
const raffleItemController = new RaffleItemController()
const solicitationController = new SolicitationController()
const cashConferenceController = new CashConferenceController()
const clientReportController = new ClientReportController()
const companyUserReportController = new CompanyUserReportController()
const cashbackReportController = new CashbackReportController()
const transactionStatusController = new TransactionStatusController()
const companyUserTypeController = new CompanyUserTypeController()
const companyPaymentMethodController = new CompanyPaymentMethodController()
const logoChangeRequestController = new LogoChangeRequestController()

const birthdayNotificationController = new BirthdayNotificationController()

const fileController = new FileController()

const routes = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

routes.post('/sign-up', auth.registerNewCompany)
routes.post('/sign-in', auth.signUserCompany)
routes.get('/verify-token', auth.verifyToken)
routes.get('/industries/find', companyData.findIndustries)
routes.post('/forgot-password', auth.forgotPassword)
routes.post('/reset-password', auth.resetPassword)

routes.use(DecodeTokenMiddleware, AuthCompanyMiddleware)

routes.post('/file-upload', upload.single('file'), fileController.store)

routes.get('/data/dashboard', reports.dashboardReports)
routes.get('/data/find', companyData.findCompanyData)
routes.put('/data/update', companyData.updateCompanyData)

routes.put('/support/update/permission', companySupport.updatePermission)
routes.get('/support/find/permission', companySupport.findPermission)

routes.get('/payments-methods/find/system', paymentMethod.findPaymentMethods)
routes.get('/payments-methods/find', paymentMethod.findCompanyPaymentMethods)
routes.get(
  '/payments-methods/find/cashier',
  paymentMethod.findCompanyPaymentMethodsForCashier,
)
routes.put('/payments-methods/update', paymentMethod.updateCompanyPaymentMethod)
routes.post(
  '/payments-methods/register',
  paymentMethod.registerCompanyPaymentMethod,
)

routes.get('/user/find', companyUser.findCompanyUsers)
routes.post('/user/register', companyUser.registerCompanyUser)
routes.put('/user/register-cpf', companyUser.registerCompanyUserRootCPF)
routes.put('/user/update/:id', companyUser.updateCompanyUser)
routes.put('/user/password/update', companyUser.updatePassword)
routes.put(
  '/user/password/update/root/:id',
  companyUser.rootUserUpdateUserPassword,
)

routes.get('/cashbacks/expired', cashback.verifyCashbacksExpired)
routes.post(
  '/cashback/confirm-password',
  VerifyIfIsAuthorizedToEmitCashbacks,
  cashback.validateUserPasswordToGenerateCashback,
)
routes.get(
  '/cashback/costumer/:cpf',
  VerifyIfIsAuthorizedToEmitCashbacks,
  cashback.getConsumerInfo,
)
routes.get(
  '/cashback/costumer/autocomplete/:cpf',
  VerifyIfIsAuthorizedToEmitCashbacks,
  cashback.getConsumerAutoComplete,
)

routes.put('/cashback/cancel', cashback.cancelCashBack)
routes.get('/cashbacks/find/pending', cashback.findPendingCashbacks)
routes.get('/cashbacks/find/waiting', cashback.listWaiting)
routes.get('/cashbacks/find/all', cashback.findAllCashbacks)
routes.get('/cashbacks/find/filters', cashback.findCashbackFilters)

routes.get('/cashbacks/status', cashback.status)

routes.post('/transactions/:id/chargeback', cashback.chargeback)

routes.post(
  '/cashback/generate',
  VerifyIfIsAuthorizedToEmitCashbacks,
  cashback.generateCashback,
)

routes.post('/order/payment/generate', paymentOrder.generate)
routes.put('/order/payment/cancel/:id', paymentOrder.cancel)
routes.get('/order/payment/methods/findAll', paymentOrder.findPaymentMethod)
routes.get('/order/find/all/:offset/:limit', paymentOrder.findOrders)
routes.get(
  '/order/find/transactions/:id',
  paymentOrder.findTransactionsInPaymentOrder,
)

routes.get('/monthly/find', companyMontlhy.findCompanyMonthly)
routes.put('/monthly/update/:id', companyMontlhy.informMonthlyPayment)

routes.get('/status', companyStatus.verify)

routes.get('/withdraws', withDrawController.index)
routes.post('/withdraws', withDrawController.store)
routes.post('/withdraws/:id/cancel', withDrawController.cancel)

routes.get('/raffles', raffleController.index)
routes.get('/raffles/monthly-remaining', raffleController.monthlyRemaining)
routes.get('/raffles/:id', raffleController.show)
routes.post('/raffles', raffleController.store)
routes.put('/raffles/:id', raffleController.update)
routes.post('/raffles/:id/cancel', raffleController.cancel)
routes.post('/raffles/:id/draw', raffleController.draw)

routes.post('/raffle-items/:id/delivery', raffleItemController.confirmDelivery)

routes.get('/waiting-solicitations', solicitationController.count)

routes.get('/cash-conference', cashConferenceController.handle)

routes.get('/solicitations', solicitationController.index)
routes.put('/solicitations/approve', solicitationController.approve)
routes.put('/solicitations/reprove', solicitationController.reprove)

routes.get(
  '/notification-solicitations',
  notificationSolicitationController.index,
)
routes.post(
  '/notification-solicitations',
  notificationSolicitationController.store,
)
routes.post(
  '/notification-solicitations/audience',
  notificationSolicitationController.audienceCount,
)
routes.delete(
  '/notification-solicitations/:id',
  notificationSolicitationController.delete,
)
routes.get(
  '/notification-solicitations/monthly-remaining',
  notificationSolicitationController.monthlyRemaining,
)
routes.get('/report/clients', clientReportController.index)
routes.get('/report/clients/pdf', clientReportController.getPdf)
routes.get('/report/clients/excel', clientReportController.getExcel)
routes.get('/report/clients/totalizer', clientReportController.totalizer)

routes.get('/report/company-users', companyUserReportController.index)
routes.get('/report/company-users/pdf', companyUserReportController.getPdf)
routes.get('/report/company-users/excel', companyUserReportController.getExcel)
routes.get(
  '/report/company-users/totalizer',
  companyUserReportController.totalizer,
)

routes.get('/report/cashbacks', cashbackReportController.index)
routes.get('/report/cashbacks/pdf', cashbackReportController.getPdf)
routes.get('/report/cashbacks/excel', cashbackReportController.getExcel)
routes.get('/report/cashbacks/totalizer', cashbackReportController.totalizer)

routes.get('/company-user-types', companyUserTypeController.index)
routes.get('/transaction-status', transactionStatusController.index)
routes.get('/company-payment-methods', companyPaymentMethodController.index)

routes.get('/birthday-notifications', birthdayNotificationController.index)
routes.post('/birthday-notifications', birthdayNotificationController.store)

routes.get('/logo-change-requests', logoChangeRequestController.index)
routes.post('/logo-change-requests', logoChangeRequestController.store)
routes.delete('/logo-change-requests/:id', logoChangeRequestController.delete)

export default routes
