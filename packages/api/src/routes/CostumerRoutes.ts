import { Router } from "express";

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthCostumerMiddleware } from "../middlewares/AuthCostumerMiddleware";

import { ConstumerAuthenticationController } from "../controllers/costumer/constumerAuthentication/ConstumerAuthenticationController";
import { CostumerAccountController } from "../controllers/costumer/costumerAccount/CostumerAccountController";
import { CostumerDataController } from "../controllers/costumer/costumerData/CostumerDataController";
import { CostumerCashBackController } from "../controllers/costumer/costumerCashBack/CostumerCashBackController";
import { CostumerVerifyController } from "../controllers/costumer/costumerVerify/CostumerVerifyController";
import { CostumerCompaniesController } from "../controllers/costumer/costumerCompanies/CostumerCompaniesController";

import authorizePurchase from "../useCases/consumer/authorizePurchaseUseCase";
import getHomeData from "../useCases/consumer/getHomeDataUseCase";
import updateConsumerData from "../useCases/consumer/updateConsumerDataUseCase";
import getAllConsumerTransactions from "../useCases/consumer/getAllConsumerTransactionsUseCase";
import getConsumerTransactionDetailsUseCase from "../useCases/consumer/getConsumerTransactionDetailsUseCase";
import getConsumerTransferInfoUseCase from "../useCases/consumer/getConsumerTransferInfoUseCase";
import transferBalanceUseCase from "../useCases/consumer/transferBalanceUseCase";
import getConsumerDataInfo from "../useCases/consumer/getConsumerDataInfo";
import { RaffleController } from "../controllers/costumer/raffle/RaffleController";
import { ExtractController } from "../controllers/costumer/extract/ExtractController";
import { RaffleItemController } from "../controllers/costumer/raffle/RaffleItemController";
import { ProfileController } from "../controllers/costumer/ProfileController";
import { TicketController } from "../controllers/costumer/raffle/TicketController";
import { BalanceController } from "../controllers/costumer/BalanceController";
import { SolicitationController } from "../controllers/costumer/SolicitationController";
import { authorize } from "../controllers/costumer/costumerCashBack/AuthorizeController";
import { NotificationController } from "../controllers/costumer/NotificationController";
import { MissingFieldController } from "../controllers/costumer/MissingFieldController";
import { ReferralController } from "../controllers/costumer/ReferralController";

const costumerAuth = new ConstumerAuthenticationController();
const costumerAccount = new CostumerAccountController();
const costumerData = new CostumerDataController();
const costumerCashBack = new CostumerCashBackController();
const costumerVerify = new CostumerVerifyController();
const costumerCompanies = new CostumerCompaniesController();
const raffle = new RaffleController();
const raffleItemController = new RaffleItemController();
const extractController = new ExtractController();
const profileController = new ProfileController();
const ticketController = new TicketController();
const balanceController = new BalanceController();
const solicitationController = new SolicitationController();
const notificationController = new NotificationController();
const missingFieldController = new MissingFieldController();
const referralController = new ReferralController();

const routes = Router();

routes.post("/sign-in", costumerAuth.signInCostumer);
routes.post("/sign-up", costumerAccount.registerCostumer);
routes.post("/refresh-token/:refreshToken", costumerAuth.refreshToken);
routes.post("/forgot-password", costumerAuth.forgotPassword);
routes.post("/reset-password", costumerAuth.resetPassword);
routes.get("/verify-if-exists/:cpf", costumerAccount.verifyIfUserAlreadyExists);

routes.post("/signature/reset", costumerData.resetSignature);

routes.use(DecodeTokenMiddleware, AuthCostumerMiddleware);

routes.get("/data/find", costumerData.findAppData);
routes.get("/data/home", getHomeData.handle);
routes.get("/data/consumer", getConsumerDataInfo.handle);

routes.put("/update/data", costumerData.updateData);
routes.put("/update/phone", costumerData.updatePhone);
routes.put("/update/email", costumerData.updateEmail);
routes.put("/update/address", costumerData.updateAddress);
routes.put("/update/data/v2", updateConsumerData.handle);

routes.put("/update-account", costumerAccount.updateConsumer);

routes.post("/signature/register", costumerData.registerSignature);
routes.put("/signature/update", costumerData.updateSignature);
routes.post("/signature/forgot", costumerData.forgotSignature);

routes.get("/companies/find/filters", costumerCompanies.findCompanyFilters);
routes.get("/companies/find", costumerCompanies.findCompanies);
routes.get("/companies/find/:offset/:limit", costumerData.findCompanies); // DESCONTINUADA v1.2.1
routes.get("/company/find/one/:id", costumerData.findOneCompany);
routes.get("/company/filter", costumerData.filterCompanies); // DESCONTINUADA v1.2.1

routes.put("/update/password", costumerAuth.updateCostumerPassword);
routes.delete("/account/deactive", costumerAccount.desactiveCostumer);

routes.post("/cashback/authorize", costumerCashBack.authorizePurchase);
routes.post("/cashback/authorize/purchase", authorizePurchase.handle);
routes.get("/cashback/find/:offset/:limit", costumerCashBack.findTransaction);
routes.get("/cashback/details/:id", costumerCashBack.findCashbackDetails);
routes.delete("/cashback/delete/:id", costumerCashBack.dropTransaction);

routes.get("/transactions/find", getAllConsumerTransactions.handle);
routes.get(
  "/transactions/details/:id",
  getConsumerTransactionDetailsUseCase.handle
);

routes.get(
  "/transfer/get-consumer/:cpf",
  getConsumerTransferInfoUseCase.handle
);
routes.post("/transfer/consumer", transferBalanceUseCase.handle);

routes.get("/verify/send-mail", costumerVerify.sendMailToVerify);
routes.post("/verify/email", costumerVerify.verifyEmail);

routes.post("/authorize", authorize);
routes.get("/raffles/ongoing", raffle.ongoing);
routes.get("/raffles/finished", raffle.finished);
routes.get("/raffles/participating", raffle.participating);

routes.get("/raffles/:id/show", raffle.show);

routes.get("/tickets", ticketController.index);
routes.get("/tickets/pending-count", ticketController.pendingCount);

routes.post("/raffle-items/:id/start-delivery", raffleItemController.delivery);

routes.get("/extract", extractController.index);
routes.get("/extract/transactions/:id", extractController.showTransaction);
routes.get("/extract/transfers/:id", extractController.showTransfer);

routes.post("/profile/deactivate", profileController.deactivate);
routes.get("/me", profileController.me);
routes.post("/balance/validate", balanceController.validate);
routes.get("/balance/payment-free", balanceController.freeBalance);

routes.post("/solicitations/cashback", solicitationController.cashback);
routes.post("/solicitations/payment", solicitationController.payment);
routes.post("/notification-token", profileController.notificationToken);

routes.get("/missing-fields", missingFieldController.index);
routes.get("/monthly-incomes", missingFieldController.monthlyIncomes);

routes.get("/notifications", notificationController.index);
routes.get(
  "/notifications/unread-count",
  notificationController.unreadNotificationCount
);

routes.get("/referrals", referralController.index);
routes.post("/referrals", referralController.store);
routes.delete("/referrals/:id", referralController.delete);

export default routes;
