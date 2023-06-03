import { Router } from "express";
import multer from "multer";

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthManagerMiddleware } from "../middlewares/AuthManagerMiddleware";
// import { TicketMiddleware } from "../middlewares/TicketMiddleware";

import { ManagerAuthController } from "../controllers/manager/managerAuth/ManagerAuthController";
import { CompaniesController } from "../controllers/manager/managerCompanies/CompaniesController";
import { ConsumersController } from "../controllers/manager/managerConsumers/ConsumersController";
import { ManagerIndustryController } from "../controllers/manager/managerIndustry/ManagerIndustryController";
import { PaymentMethodController } from "../controllers/manager/managerMethods/PaymentMethodsController";
import { ManagerCompanyStatusController } from "../controllers/manager/managerCompanyStatus/ManagerCompanyStatusController";
import { DataController } from "../controllers/manager/managerData/DataController";
import { DashboardController as ManagerDashboardController } from "../controllers/manager/managerDashboard/ManagerDashboardController";
import { PaymentPlanController } from "../controllers/manager/managerPaymentPlan/PaymentPlanController";
import { PaymentOrderController } from "../controllers/manager/managerPaymentOrder/PaymentOrderController";
import { ManagerCitiesController } from "../controllers/manager/managerCities/ManagerCitiesController";
import { ReportsController } from "../controllers/manager/managerReports/ReportsController";
import { ManagerCashbacksController } from "../controllers/manager/managerCashback/ManagerCashbacksController";
import { ManagerSupportController } from "../controllers/manager/managerSupport/ManagerSupportController";
import { ManagerCompanyPaymentMontlhyController } from "../controllers/manager/managerCompanyPaymentMontlhy/ManagerCompanyPaymentMontlhyController";
import { UserCompaniesController } from "../controllers/manager/managerCompanies/UserCompaniesController";
import { WithDrawController } from "../controllers/manager/withdraw/WithDrawController";
import { RaffleController } from "../controllers/manager/raffle/RaffleController";
import { BonusController } from "../controllers/manager/bonus/BonusController";
import { DashboardController } from "../controllers/manager/dashboard/DashboardController";
import { NotificationSolicitationController } from "../controllers/manager/NotificationSolicitationController";
import { RepresentativeController } from "../controllers/manager/RepresentativeController";

const paymentMethod = new PaymentMethodController();
const managerAuth = new ManagerAuthController();
const managerIndustry = new ManagerIndustryController();
const managerCompanies = new CompaniesController();
const managerConsumers = new ConsumersController();
const managerCompanyStatus = new ManagerCompanyStatusController();
const managerData = new DataController();
const managerDashboard = new ManagerDashboardController();
const managerPaymentPlan = new PaymentPlanController();
const managerPaymentOrder = new PaymentOrderController();
const managerCities = new ManagerCitiesController();
const managerReports = new ReportsController();
const managerCashback = new ManagerCashbacksController();
const managerSupport = new ManagerSupportController();
const managerCompanyMontlhy = new ManagerCompanyPaymentMontlhyController();
const representativeController = new RepresentativeController();
const managerCompaniesUsers = new UserCompaniesController();
const withDrawController = new WithDrawController();

const notificationSolicitationController =
  new NotificationSolicitationController();

const raffleController = new RaffleController();
const bonusController = new BonusController();
const dashboardController = new DashboardController();

const routes = Router();

routes.post("/user/login", managerAuth.signInUser);
routes.get("/verify-token", managerAuth.verifyToken);
routes.post("/reset-password", managerAuth.resetPassword);
routes.post("/forgot-password", managerAuth.forgotPassword);

routes.use(DecodeTokenMiddleware, AuthManagerMiddleware);

routes.get("/data/find", managerData.findDataToUseInApp);

routes.post("/user/register", managerAuth.registerUser);
routes.put("/user/update/:id", managerAuth.updateUser);
routes.get("/user/find/:offset/:limit", managerAuth.findUser);
routes.put("/user/password/update", managerAuth.updateUserPassword);
routes.get("/user/types/find", managerAuth.findUserType);

routes.post("/industry", managerIndustry.registerIndustry);
routes.put("/industry/:id", managerIndustry.updateIndustry);
routes.get("/industry/find", managerIndustry.findAllIndustries);

routes.get("/companies/:id/users", managerCompaniesUsers.findUserCompanies);
routes.put(
  "/company/user/update/:id",
  managerCompaniesUsers.updateUserFromCompany
);

routes.post("/company/allow-access", managerCompanies.allowFirstAccess);
routes.get("/companies/find", managerCompanies.findCompanies);
routes.get("/company/find/one/:id", managerCompanies.findOneCompany);
routes.put("/company/update/:id", managerCompanies.updateCompany);
routes.put("/company/fee/update/:id", managerCompanies.updateCustomFee);
routes.get("/company/status/find", managerCompanyStatus.findCompanyStatus);
routes.put(
  "/company/status/update/:id",
  managerCompanyStatus.updateCompanyStatus
);
routes.put("/company/plan/update/:id", managerCompanies.updatePaymentPlan);
routes.put(
  "/company/forgot-password/:id",
  managerCompanies.forgotPasswordToRootUser
);
routes.put(
  "/company/many-status/update/",
  managerCompanies.updateManyCompanyStatus
);
routes.post(
  "/company/provisional-access/generate/:id",
  managerCompanyStatus.generateProvisionalAccess
);
// routes.put(
//   "/company/representative",
//   managerCompanies.relationWithRepresentative
// );

routes.put(
  "/company/:id/representative",
  managerCompanies.relationWithRepresentative
);

routes.get("/consumers/find", managerConsumers.findConsumers);
routes.get("/consumers/find/one/:id", managerConsumers.findOneConsumer);
routes.put(
  "/consumers/update/status/:id",
  managerConsumers.updateConsumerStatus
);
routes.put(
  "/consumers/forgot-password/:id",
  managerConsumers.forgotCostumerPassword
);

routes.get("/cities", managerData.cities);
routes.get("/cities/findAll", managerConsumers.listCities);
routes.get("/cities/find/all", managerCities.findAllCities);

routes.get("/payment/find", paymentMethod.findAll);
routes.post("/payment/register", paymentMethod.register);
routes.put("/payment/update/:id", paymentMethod.update);

routes.get("/plan/find", managerPaymentPlan.findAll);
routes.post("/plan/register", managerPaymentPlan.register);
routes.put("/plan/update/:id", managerPaymentPlan.update);

routes.get("/dashboard/find", managerDashboard.dashboardReport);

routes.get("/orders/find", managerPaymentOrder.findOrders);
routes.get("/orders/find/:orderId", managerPaymentOrder.findOrderDetails);
routes.get("/order/find/filters", managerPaymentOrder.findFilterOptions);
routes.get(
  "/order/find/transactions/:id",
  managerPaymentOrder.findTransactionsInPaymentOrder
);
routes.put(
  "/order/approve/:id",
  managerPaymentOrder.approveOrderAndReleaseCashbacks
);
routes.put(
  "/order/update/status/:id",
  managerPaymentOrder.updatePaymentOrderStatus
);

routes.get("/cashback/find", managerCashback.findCashbacks);
routes.get("/cashback/find/status", managerCashback.findStatus);

routes.get("/montlhy/find", managerCompanyMontlhy.findCompanyMonthlies);
routes.put("/montlhy/confirm", managerCompanyMontlhy.confirmPaymentMonthly);
routes.put("/montlhy/forgiven", managerCompanyMontlhy.forgivenPaymentMonthly);
routes.put("/montlhy/update", managerCompanyMontlhy.updatePaymentMonthlyPlan);

routes.post("/support/register", managerSupport.registerSupportUser);
routes.put("/support/update/:id", managerSupport.updateSupportUser);
routes.get("/support/find/all", managerSupport.findAllSupportUsers);

routes.get("/report/find/filters", managerReports.findFilterOptions);
routes.get("/report/payment-order", managerReports.paymentOrderReport);
routes.get("/report/monthly-payment", managerReports.monthlyReport);
routes.get("/report/companies", managerReports.CompaniesReport);
routes.get("/report/cashbacks", managerReports.CashbacksReport);

// routes.post("/representative/register", managerRepresentatives.register);
// routes.get("/representative/find", managerRepresentatives.find);
// routes.put("/representative/update", managerRepresentatives.update);

routes.get("/representatives", representativeController.index);
routes.post("/representatives", representativeController.store);
routes.get("/representatives/:id", representativeController.show);
routes.put("/representatives/:id", representativeController.update);
routes.post(
  "/representatives/:id/deactivate",
  representativeController.deactivate
);
routes.post("/representatives/:id/activate", representativeController.activate);

routes.get("/withdraws", withDrawController.index);
routes.get("/withdraws/:id", withDrawController.show);
routes.patch("/withdraws/:id/approve", withDrawController.approve);
routes.patch("/withdraws/:id/cancel", withDrawController.cancel);

routes.get("/raffles", raffleController.index);
routes.get("/raffles/:id", raffleController.show);
routes.put("/raffles/:id", raffleController.update);

routes.get("/bonus", bonusController.index);
routes.get("/bonus/:id", bonusController.show);

routes.get("/dashboard/totalizer", dashboardController.totalizer);
routes.get("/dashboard/fee-graph", dashboardController.feeGraph);
routes.get("/dashboard/cashback-graph", dashboardController.cashbackGraph);
routes.get("/dashboard/bonus-graph", dashboardController.bonusGraph);
routes.get(
  "/dashboard/expire-balance-graph",
  dashboardController.expireBalanceGraph
);
routes.get(
  "/dashboard/expire-balance-forecast-graph",
  dashboardController.expireBalanceForecastGraph
);

routes.get(
  "/notification-solicitations",
  notificationSolicitationController.index
);

routes.get(
  "/notification-solicitations/:id",
  notificationSolicitationController.show
);

routes.put(
  "/notification-solicitations/:id/approve",
  notificationSolicitationController.approve
);

routes.put(
  "/notification-solicitations/:id/reprove",
  notificationSolicitationController.reprove
);

export default routes;
