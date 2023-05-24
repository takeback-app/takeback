import dotenv from "dotenv";

dotenv.config();

import { CompaniesMonthliesVerifyUseCase } from "../useCases/shared/CompaniesMonthliesVerifyUseCase";
import { VerifyProvisionalAccessUseCase } from "../controllers/manager/managerCompanies/VerifyProvisionalAccessUseCase";
import { ExpireTransactionsUseCase } from "../useCases/shared/ExpireTransactionsUseCase";
import { connectTypeorm } from "../database";

async function main() {
  await connectTypeorm();

  await new CompaniesMonthliesVerifyUseCase().execute();
  await new ExpireTransactionsUseCase().execute();
  await new VerifyProvisionalAccessUseCase().execute();

  return process.exit(0);
}

main();
