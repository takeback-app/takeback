import path from 'node:path'

export default {
  // PRODUÇÃO = false
  // HOMOLOGAÇÃO = true
  sandbox: process.env.APP_ENV !== 'production',
  client_id: process.env.EFI_CLIENT_ID,
  client_secret: process.env.EFI_CLIENT_SECRET,
  pix_cert: path.resolve(process.env.PWD, `${process.env.EFI_CERT_PATH}`),
  validateMtls: false,
}
