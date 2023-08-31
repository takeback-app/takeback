import { Router } from 'express'
import multer from 'multer'

import { DecodeTokenMiddleware } from '../middlewares/DecodeTokenMiddleware'
import { AuthManagerMiddleware } from '../middlewares/AuthManagerMiddleware'
// import { TicketMiddleware } from "../middlewares/TicketMiddleware";

import { ManagerAuthController } from '../controllers/manager/managerAuth/ManagerAuthController'
import { CompaniesController } from '../controllers/manager/managerCompanies/CompaniesController'
import { ConsumersController } from '../controllers/manager/managerConsumers/ConsumersController'
import { ManagerIndustryController } from '../controllers/manager/managerIndustry/ManagerIndustryController'
import { PaymentMethodController } from '../controllers/manager/managerMethods/PaymentMethodsController'
import { ManagerCompanyStatusController } from '../controllers/manager/managerCompanyStatus/ManagerCompanyStatusController'
import { DataController } from '../controllers/manager/managerData/DataController'
import { DashboardController as ManagerDashboardController } from '../controllers/manager/managerDashboard/ManagerDashboardController'
import { PaymentPlanController } from '../controllers/manager/managerPaymentPlan/PaymentPlanController'
import { PaymentOrderController } from '../controllers/manager/managerPaymentOrder/PaymentOrderController'
import { ManagerCitiesController } from '../controllers/manager/managerCities/ManagerCitiesController'
import { ManagerCashbacksController } from '../controllers/manager/managerCashback/ManagerCashbacksController'
import { ManagerSupportController } from '../controllers/manager/managerSupport/ManagerSupportController'
import { ManagerCompanyPaymentMontlhyController } from '../controllers/manager/managerCompanyPaymentMontlhy/ManagerCompanyPaymentMontlhyController'
import { UserCompaniesController } from '../controllers/manager/managerCompanies/UserCompaniesController'
import { WithDrawController } from '../controllers/manager/withdraw/WithDrawController'
import { RaffleController } from '../controllers/manager/raffle/RaffleController'
import { BonusController } from '../controllers/manager/bonus/BonusController'
import { DashboardController } from '../controllers/manager/dashboard/DashboardController'
import { NotificationSolicitationController } from '../controllers/manager/NotificationSolicitationController'
import { CompaniesReportController } from '../controllers/manager/managerReports/CompaniesReportController'
import { RepresentativeController } from '../controllers/manager/RepresentativeController'
import { LogoChangeRequestController } from '../controllers/manager/LogoChangeRequestController'
import { ReferralBonusController } from '../controllers/manager/ReferralBonusController'
import { FileController } from '../controllers/company/FileController'
import { NotificationController } from '../controllers/manager/notification/NotificationController'
import { StoreProductController } from '../controllers/manager/store/StoreProductController'
import { CashbackReportController } from '../controllers/manager/reports/CashbackReportController'
import { ReportFilterController } from '../controllers/manager/reports/ReportFilterController'
import { ClientReportController } from '../controllers/manager/reports/ClientReportController'
import { SellerReportController } from '../controllers/manager/reports/SellerReportController'
import { CompanyUserTypeController } from '../controllers/manager/CompanyUserTypeController'
import { TransactionStatusController } from '../controllers/manager/TransactionStatusController'
import { CompanyReportController } from '../controllers/manager/reports/CompanyReportController'
import { FinancialReportController } from '../controllers/manager/reports/FinancialReportController'

const paymentMethod = new PaymentMethodController()
const managerAuth = new ManagerAuthController()
const managerIndustry = new ManagerIndustryController()
const managerCompanies = new CompaniesController()
const managerConsumers = new ConsumersController()
const managerCompanyStatus = new ManagerCompanyStatusController()
const managerData = new DataController()
const managerDashboard = new ManagerDashboardController()
const managerPaymentPlan = new PaymentPlanController()
const managerPaymentOrder = new PaymentOrderController()
const managerCities = new ManagerCitiesController()
const managerCashback = new ManagerCashbacksController()
const managerSupport = new ManagerSupportController()
const managerCompanyMontlhy = new ManagerCompanyPaymentMontlhyController()
const representativeController = new RepresentativeController()
const managerCompaniesUsers = new UserCompaniesController()
const withDrawController = new WithDrawController()
const companiesReport = new CompaniesReportController()
const logoChangeRequestController = new LogoChangeRequestController()
const referralBonusController = new ReferralBonusController()
const cashbackReportController = new CashbackReportController()
const clientReportController = new ClientReportController()
const sellerReportController = new SellerReportController()
const financialReportController = new FinancialReportController()

const companyReportController = new CompanyReportController()
const reportFilterController = new ReportFilterController()
const companyUserTypeController = new CompanyUserTypeController()
const transactionStatusController = new TransactionStatusController()

const notificationSolicitationController =
  new NotificationSolicitationController()

const raffleController = new RaffleController()
const bonusController = new BonusController()
const dashboardController = new DashboardController()
const notificationController = new NotificationController()

const storeProductController = new StoreProductController()

const fileController = new FileController()

const routes = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

routes.post('/user/login', managerAuth.signInUser)
routes.get('/verify-token', managerAuth.verifyToken)
routes.post('/reset-password', managerAuth.resetPassword)
routes.post('/forgot-password', managerAuth.forgotPassword)

routes.use(DecodeTokenMiddleware, AuthManagerMiddleware)

routes.post('/file-upload', upload.single('file'), fileController.store)

routes.get('/data/find', managerData.findDataToUseInApp)

routes.post('/user/register', managerAuth.registerUser)
routes.put('/user/update/:id', managerAuth.updateUser)
routes.get('/user/find/:offset/:limit', managerAuth.findUser)
routes.put('/user/password/update', managerAuth.updateUserPassword)
routes.get('/user/types/find', managerAuth.findUserType)

routes.post('/industry', managerIndustry.registerIndustry)
routes.put('/industry/:id', managerIndustry.updateIndustry)
routes.get('/industry/find', managerIndustry.findAllIndustries)

routes.put('/companies/:id/logo', managerCompanies.updateCompanyLogo)

routes.get('/companies/:id/integration', managerCompanies.getIntegration)
routes.put('/companies/:id/integration', managerCompanies.updateIntegration)

routes.delete('/integration/:id', managerCompanies.deleteIntegration)

routes.get('/companies/:id/users', managerCompaniesUsers.findUserCompanies)
routes.put(
  '/company/user/update/:id',
  managerCompaniesUsers.updateUserFromCompany,
)

routes.post('/company/allow-access', managerCompanies.allowFirstAccess)
routes.get('/companies/find', managerCompanies.findCompanies)
routes.get('/company/find/one/:id', managerCompanies.findOneCompany)
routes.put('/company/update/:id', managerCompanies.updateCompany)
routes.put('/company/fee/update/:id', managerCompanies.updateCustomFee)
routes.get('/company/status/find', managerCompanyStatus.findCompanyStatus)
routes.put(
  '/company/status/update/:id',
  managerCompanyStatus.updateCompanyStatus,
)
routes.put('/company/plan/update/:id', managerCompanies.updatePaymentPlan)
routes.put(
  '/company/forgot-password/:id',
  managerCompanies.forgotPasswordToRootUser,
)
routes.put(
  '/company/many-status/update/',
  managerCompanies.updateManyCompanyStatus,
)
routes.post(
  '/company/provisional-access/generate/:id',
  managerCompanyStatus.generateProvisionalAccess,
)
// routes.put(
//   "/company/representative",
//   managerCompanies.relationWithRepresentative
// );

routes.put(
  '/company/:id/representative',
  managerCompanies.relationWithRepresentative,
)

routes.get('/consumers/find', managerConsumers.findConsumers)
routes.get('/consumers/find/one/:id', managerConsumers.findOneConsumer)
routes.put(
  '/consumers/update/status/:id',
  managerConsumers.updateConsumerStatus,
)
routes.put(
  '/consumers/forgot-password/:id',
  managerConsumers.forgotCostumerPassword,
)

routes.get('/cities', managerData.cities)
routes.get('/cities/findAll', managerConsumers.listCities)
routes.get('/cities/find/all', managerCities.findAllCities)

routes.get('/payment/find', paymentMethod.findAll)
routes.post('/payment/register', paymentMethod.register)
routes.put('/payment/update/:id', paymentMethod.update)

routes.get('/plan/find', managerPaymentPlan.findAll)
routes.post('/plan/register', managerPaymentPlan.register)
routes.put('/plan/update/:id', managerPaymentPlan.update)

routes.get('/dashboard/find', managerDashboard.dashboardReport)

routes.get('/orders/find', managerPaymentOrder.findOrders)
routes.get('/orders/find/:orderId', managerPaymentOrder.findOrderDetails)
routes.get('/order/find/filters', managerPaymentOrder.findFilterOptions)
routes.get(
  '/order/find/transactions/:id',
  managerPaymentOrder.findTransactionsInPaymentOrder,
)
routes.put(
  '/order/approve/:id',
  managerPaymentOrder.approveOrderAndReleaseCashbacks,
)
routes.put(
  '/order/update/status/:id',
  managerPaymentOrder.updatePaymentOrderStatus,
)

routes.get('/cashback/find', managerCashback.findCashbacks)
routes.get('/cashback/find/status', managerCashback.findStatus)

routes.get('/montlhy/find', managerCompanyMontlhy.findCompanyMonthlies)
routes.put('/montlhy/confirm', managerCompanyMontlhy.confirmPaymentMonthly)
routes.put('/montlhy/forgiven', managerCompanyMontlhy.forgivenPaymentMonthly)
routes.put('/montlhy/update', managerCompanyMontlhy.updatePaymentMonthlyPlan)

routes.post('/support/register', managerSupport.registerSupportUser)
routes.put('/support/update/:id', managerSupport.updateSupportUser)
routes.get('/support/find/all', managerSupport.findAllSupportUsers)

// routes.get('/report/selers', selersReport.index)
// routes.get('/report/selers/pdf', selersReport.getPdf)
// routes.get('/report/selers/excel', selersReport.getExcel)
// routes.get('/report/selers/totalizer', selersReport.totalizer)

// routes.get('/report/financial', financialReport.index)
// routes.get('/report/financial/pdf', financialReport.getPdf)
// routes.get('/report/financial/excel', financialReport.getExcel)
// routes.get('/report/financial/totalizer', financialReport.totalizer)

// routes.get('/report/find/filters', managerReports.findFilterOptions)
// routes.get('/report/payment-order', managerReports.paymentOrderReport)
// routes.get('/report/monthly-payment', managerReports.monthlyReport)

routes.get('/report/filters/states', reportFilterController.states)
routes.get('/report/filters/cities', reportFilterController.cities)
routes.get('/report/filters/companies', reportFilterController.companies)
routes.get(
  '/report/filters/companyStatus',
  reportFilterController.companyStatus,
)
routes.get('/report/filters/companyUsers', reportFilterController.companyUsers)
routes.get(
  '/report/filters/transactionStatus',
  reportFilterController.transactionStatus,
)
routes.get(
  '/report/filters/paymentMethods',
  reportFilterController.paymentMethods,
)

routes.get('/report/clients', clientReportController.index)
routes.get('/report/clients/pdf', clientReportController.getPdf)
routes.get('/report/clients/excel', clientReportController.getExcel)
routes.get('/report/clients/totalizer', clientReportController.getTotalizer)

routes.get('/report/companies', companiesReport.index)
routes.get('/report/companies/pdf', companiesReport.getPdf)
routes.get('/report/companies/excel', companiesReport.getExcel)
routes.get('/report/companies/totalizer', companiesReport.totalizer)

routes.get('/report/seller', sellerReportController.index)
routes.get('/report/seller/pdf', sellerReportController.getPdf)
routes.get('/report/seller/excel', sellerReportController.getExcel)
routes.get('/report/seller/totalizer', sellerReportController.getTotalizer)

routes.get('/report/cashbacks', cashbackReportController.index)
routes.get('/report/cashbacks/pdf', cashbackReportController.getPdf)
routes.get('/report/cashbacks/excel', cashbackReportController.getExcel)
routes.get('/report/cashbacks/totalizer', cashbackReportController.getTotalizer)

routes.get('/report/company', companyReportController.index)
routes.get('/report/company/pdf', companyReportController.getPdf)
routes.get('/report/company/excel', companyReportController.getExcel)
routes.get('/report/company/totalizer', companyReportController.totalizer)

routes.get('/report/financial', financialReportController.index)
routes.get('/report/financial/pdf', financialReportController.getPdf)
routes.get('/report/financial/excel', financialReportController.getExcel)
routes.get(
  '/report/financial/totalizer',
  financialReportController.getTotalizer,
)

routes.get('/company-user-types', companyUserTypeController.index)
routes.get('/transaction-status', transactionStatusController.index)

// routes.post("/representative/register", managerRepresentatives.register);
// routes.get("/representative/find", managerRepresentatives.find);
// routes.put("/representative/update", managerRepresentatives.update);

routes.get('/representatives', representativeController.index)
routes.post('/representatives', representativeController.store)
routes.get('/representatives/:id', representativeController.show)
routes.put('/representatives/:id', representativeController.update)
routes.post(
  '/representatives/:id/deactivate',
  representativeController.deactivate,
)
routes.post('/representatives/:id/activate', representativeController.activate)

routes.get('/withdraws', withDrawController.index)
routes.get('/withdraws/:id', withDrawController.show)
routes.patch('/withdraws/:id/approve', withDrawController.approve)
routes.patch('/withdraws/:id/cancel', withDrawController.cancel)

routes.get('/raffles', raffleController.index)
routes.get('/raffles/:id', raffleController.show)
routes.put('/raffles/:id', raffleController.update)

routes.get('/bonus', bonusController.index)
routes.get('/bonus/:id', bonusController.show)

routes.get('/dashboard/totalizer', dashboardController.totalizer)
routes.get('/dashboard/fee-graph', dashboardController.feeGraph)
routes.get('/dashboard/cashback-graph', dashboardController.cashbackGraph)
routes.get('/dashboard/bonus-graph', dashboardController.bonusGraph)
routes.get(
  '/dashboard/expire-balance-graph',
  dashboardController.expireBalanceGraph,
)
routes.get(
  '/dashboard/expire-balance-forecast-graph',
  dashboardController.expireBalanceForecastGraph,
)
routes.get('/dashboard/store-value', dashboardController.storeValue)
routes.get('/dashboard/store-credit', dashboardController.storeCredit)

routes.get(
  '/notification-solicitations',
  notificationSolicitationController.index,
)

routes.get(
  '/notification-solicitations/:id',
  notificationSolicitationController.show,
)

routes.put(
  '/notification-solicitations/:id/approve',
  notificationSolicitationController.approve,
)

routes.put(
  '/notification-solicitations/:id/reprove',
  notificationSolicitationController.reprove,
)

routes.get('/notifications', notificationController.index)
routes.get('/unread-notifications', notificationController.unread)
routes.put('/notifications/:id', notificationController.update)
routes.patch('/notifications', notificationController.updateMany)

routes.get('/logo-change-requests', logoChangeRequestController.index)
routes.put(
  '/logo-change-requests/:id/approve',
  logoChangeRequestController.approve,
)
routes.put(
  '/logo-change-requests/:id/reprove',
  logoChangeRequestController.reprove,
)

routes.get('/referral-percentage', referralBonusController.index)
routes.put('/referral-percentage', referralBonusController.update)

routes.get('/store/companies', storeProductController.listCompanies)
routes.get('/store/products', storeProductController.index)
routes.get('/store/products/:id', storeProductController.show)
routes.post('/store/products', storeProductController.store)
routes.delete('/store/products/:id', storeProductController.delete)

export default routes
