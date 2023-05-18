import { Router } from "express";

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";

import getIndustries from "../useCases/shared/getIndustriesUseCase";
import getCompanyStatus from "../useCases/shared/getCompanyStatusUseCase";
import getCities from "../useCases/shared/getCitiesUseCase";
import getPaymentPlans from "../useCases/shared/getPaymentPlansUseCase";

const routes = Router();

routes.use(DecodeTokenMiddleware);
routes.get("/industries/get", getIndustries.handle);
routes.get("/company/status/get", getCompanyStatus.handle);
routes.get("/cities/get", getCities.handle);
routes.get("/plans/get", getPaymentPlans.handle);

export default routes;
