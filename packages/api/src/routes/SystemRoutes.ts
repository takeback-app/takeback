import { Router } from "express";

import { ScheduledController } from "../controllers/system/scheduled/ScheduledController";

const scheduled = new ScheduledController();

const routes = Router();

routes.get("/run-checks", scheduled.runChecks);

export default routes;
