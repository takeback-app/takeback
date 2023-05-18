import { z } from "zod";

const cashConferenceFilterTypeEnum = z.enum(["all", "pending", "approved"]);
export type CashConferenceFilterTypeEnum = z.infer<
  typeof cashConferenceFilterTypeEnum
>;

export const CashConferenceRequest = z
  .object({
    date: z.string().datetime(),
    type: cashConferenceFilterTypeEnum,
  })
  .strict();
