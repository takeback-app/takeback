import { Router } from "express";
import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthRepresentativeMiddleware } from "../middlewares/AuthRepresentativeMiddleware";

import { AuthController } from "../controllers/representative/AuthController";
import { DashboardController } from "../controllers/representative/DashboardController";
import { CompanyController } from "../controllers/representative/CompanyController";
import { WithdrawController } from "../controllers/representative/WithdrawController";
import { RaffleController } from "../controllers/representative/RaffleController";
import { CashbackHistoricController } from "../controllers/representative/CashbackHistoricController";

const authController = new AuthController();
const dashboardController = new DashboardController();
const companyController = new CompanyController();
const withdrawController = new WithdrawController();
const raffleController = new RaffleController();
const cashbackHistoricController = new CashbackHistoricController();

const routes = Router();

routes.post("/sign-in", authController.signIn);
routes.get("/verify-token", authController.verifyToken);

routes.use(DecodeTokenMiddleware, AuthRepresentativeMiddleware);

routes.get("/dashboard", dashboardController.index);

routes.get("/companies", companyController.index);
routes.post("/companies", companyController.store);
routes.put("/companies/:id", companyController.update);

routes.get("/forget-password/:id", companyController.forgotPasswordToRootUser);

routes.get("/withdraws", withdrawController.index);
routes.post("/withdraws", withdrawController.store);
routes.post("/withdraws/:id/cancel", withdrawController.cancel);

routes.get("/raffles", raffleController.index);
routes.get("/raffles/:id", raffleController.show);

routes.get("/cashback/find", cashbackHistoricController.findCashbacks);
routes.get("/cashback/find/status", cashbackHistoricController.findStatus);

export default routes;
