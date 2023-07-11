/* eslint-disable no-use-before-define */

export interface Nfe {
  infNFe: InfNfe
  infNFeSupl: InfNfeSupl
  Signature: Signature
}

export interface InfNfe {
  ide: Ide
  emit: Emit
  det: Det[]
  total: Total
  transp: Transp
  pag: Pag
  infAdic: InfAdic
}

export interface Ide {
  cUF: number
  cNF: number
  natOp: string
  mod: number
  serie: number
  nNF: number
  dhEmi: string
  tpNF: number
  idDest: number
  cMunFG: number
  tpImp: number
  tpEmis: number
  cDV: number
  tpAmb: number
  finNFe: number
  indFinal: number
  indPres: number
  procEmi: number
  verProc: number
}

export interface Emit {
  CNPJ: number
  xNome: string
  xFant: string
  enderEmit: EnderEmit
  IE: number
  CRT: number
}

export interface EnderEmit {
  xLgr: string
  nro: string
  xBairro: string
  cMun: number
  xMun: string
  UF: string
  CEP: number
  cPais: number
  xPais: string
  fone: number
}

export interface Det {
  prod: Prod
  imposto: Imposto
}

export interface Prod {
  cProd: number
  cEAN: number
  xProd: string
  NCM: number
  CEST?: number
  CFOP: number
  uCom: string
  qCom: number
  vUnCom: number
  vProd: number
  cEANTrib: number
  uTrib: string
  qTrib: number
  vUnTrib: number
  indTot: number
}

export interface Imposto {
  ICMS: Icms
  PIS: Pis
  COFINS: Cofins
}

export interface Icms {
  ICMSSN500?: Icmssn500
  ICMSSN102?: Icmssn102
}

export interface Icmssn500 {
  orig: number
  CSOSN: number
}

export interface Icmssn102 {
  orig: number
  CSOSN: number
}

export interface Pis {
  PISAliq: Pisaliq
}

export interface Pisaliq {
  CST: number
  vBC: number
  pPIS: number
  vPIS: number
}

export interface Cofins {
  COFINSAliq: Cofinsaliq
}

export interface Cofinsaliq {
  CST: number
  vBC: number
  pCOFINS: number
  vCOFINS: number
}

export interface Total {
  ICMSTot: Icmstot
}

export interface Icmstot {
  vBC: number
  vICMS: number
  vICMSDeson: number
  vFCP: number
  vBCST: number
  vST: number
  vFCPST: number
  vFCPSTRet: number
  vProd: number
  vFrete: number
  vSeg: number
  vDesc: number
  vII: number
  vIPI: number
  vIPIDevol: number
  vPIS: number
  vCOFINS: number
  vOutro: number
  vNF: number
}

export interface Transp {
  modFrete: number
}

export interface Pag {
  detPag: DetPag | DetPag[]
  vTroco?: number
}

export interface DetPag {
  indPag: number
  tPag: number
  vPag: number
}

export interface InfAdic {
  infCpl: string
}

export interface InfNfeSupl {
  qrCode: string
  urlChave: string
}

export interface Signature {
  SignedInfo: SignedInfo
  SignatureValue: string
  KeyInfo: KeyInfo
}

export interface SignedInfo {
  CanonicalizationMethod: string
  SignatureMethod: string
  Reference: Reference
}

export interface Reference {
  Transforms: Transforms
  DigestMethod: string
  DigestValue: string
}

export interface Transforms {
  Transform: string[]
}

export interface KeyInfo {
  X509Data: X509Data
}

export interface X509Data {
  X509Certificate: string
}

export interface ProtNfe {
  infProt: InfProt
}

export interface InfProt {
  tpAmb: number
  verAplic: string
  chNFe: number
  dhRecbto: string
  nProt: number
  digVal: string
  cStat: number
  xMotivo: string
}
