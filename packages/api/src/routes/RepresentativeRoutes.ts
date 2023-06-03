import { Router } from "express";
import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthRepresentativeMiddleware } from "../middlewares/AuthRepresentativeMiddleware";

import { AuthController } from "../controllers/representative/AuthController";
import { DashboardController } from "../controllers/representative/DashboardController";
import { CompanyController } from "../controllers/representative/CompanyController";
import { WithdrawController } from "../controllers/representative/WithdrawController";
import { RaffleController } from "../controllers/representative/RaffleController";
import { CashbackHistoricController } from "../controllers/representative/CashbackHistoricController";
import { DataController } from "../controllers/manager/managerData/DataController";
import { RepresentativeUserController } from "../controllers/representative/RepresentativeUserController";
import { DataController as RepresentativeDataController } from "../controllers/representative/DataController";

const authController = new AuthController();
const dashboardController = new DashboardController();
const companyController = new CompanyController();
const withdrawController = new WithdrawController();
const managerData = new DataController();
const raffleController = new RaffleController();
const cashbackHistoricController = new CashbackHistoricController();
const representativeUserController = new RepresentativeUserController();
const dataController = new RepresentativeDataController();

const routes = Router();

routes.post("/sign-in", authController.signIn);
routes.get("/verify-token", authController.verifyToken);

routes.use(DecodeTokenMiddleware, AuthRepresentativeMiddleware);

routes.get("/data/find", managerData.findDataToUseInApp);

routes.get("/dashboard", dashboardController.index);
routes.get("/dashboard/commission-graph", dashboardController.commissionGraph);

routes.get("/companies/:id/root-user", companyController.rootUser);
routes.get("/companies/:id", companyController.show);
routes.get("/companies", companyController.index);
routes.post("/companies", companyController.store);
routes.post(
  "/companies/:id/reset-root-user",
  companyController.forgotPasswordToRootUser
);
routes.put("/companies/:id", companyController.update);
routes.put("/companies/:id/consultant", companyController.updateConsultant);

routes.get("/forget-password/:id", companyController.forgotPasswordToRootUser);

routes.get("/withdraws", withdrawController.index);
routes.post("/withdraws", withdrawController.store);
routes.post("/withdraws/:id/cancel", withdrawController.cancel);

routes.get("/raffles", raffleController.index);
routes.get("/raffles/:id", raffleController.show);

routes.get("/cashback/find", cashbackHistoricController.findCashbacks);
routes.get("/cashback/find/status", cashbackHistoricController.findStatus);

routes.put("/user/password", authController.updatePassword);

routes.get("/users", representativeUserController.index);
routes.post("/users", representativeUserController.store);

routes.get("/cities", dataController.cities);
routes.get("/industries", dataController.industries);
routes.get("/consultants", dataController.consultants);
routes.get("/payment-plans", dataController.paymentPlans);

export default routes;
