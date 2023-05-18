import { getRepository } from "typeorm";
import { RepresentativeRefreshTokens } from "../models/RepresentativeRefreshTokens";

export function representativeRefreshTokenRepository() {
  return getRepository(RepresentativeRefreshTokens);
}
