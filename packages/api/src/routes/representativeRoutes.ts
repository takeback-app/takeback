import { Router } from "express";

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";

import signIn from "../useCases/representative/signInUseCase";
import refreshToken from "../useCases/representative/refreshTokenUseCase";
import forgotPassword from "../useCases/representative/forgotPasswordUseCase";
import resetPassword from "../useCases/representative/resetPasswordUseCase";
import registerCompany from "../useCases/representative/registerCompany";
import dashboarReports from "../useCases/representative/dashboardReportsUseCase";
import validateToken from "../useCases/shared/validateTokenUseCase";
import updateCompany from "../useCases/representative/updateCompanyUseCase";

const routes = Router();

routes.post("/sign-in", signIn.handle);
routes.post("/refresh-token/:refreshToken", refreshToken.handle);
routes.post("/forgot-password", forgotPassword.handle);
routes.put("/reset-password", resetPassword.handle);
routes.use(DecodeTokenMiddleware);
routes.get("/token/validate", validateToken.handle);
routes.post("/company/register", registerCompany.handle);
routes.put("/company/update/:companyId", updateCompany.handle);
routes.get("/dashboard/reports", dashboarReports.handle);

export default routes;
