import { Router } from "express";

import { SupportController } from "../controllers/support/SupportController";

const support = new SupportController();

const routes = Router();

routes.post("/seed", support.generateSeeds);
routes.post("/test/send-mail", support.testSendMail);

export default routes;
