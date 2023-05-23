import { Router } from "express";
import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthRepresentativeMiddleware } from "../middlewares/AuthRepresentativeMiddleware";

import { AuthController } from "../controllers/representative/AuthController";
import { DashboardController } from "../controllers/representative/DashboardController";
import { CompanyController } from "../controllers/representative/CompanyController";

const authController = new AuthController();
const dashboardController = new DashboardController();
const companyController = new CompanyController();

const routes = Router();

routes.post("/sign-in", authController.signIn);

routes.use(DecodeTokenMiddleware, AuthRepresentativeMiddleware);

routes.get("/dashboard", dashboardController.index);
routes.get("/companies", companyController.index);
routes.post("/companies", companyController.store);
routes.put("/companies/:id", companyController.update);

routes.get("/forget-password/:id", companyController.forgotPasswordToRootUser);

export default routes;
