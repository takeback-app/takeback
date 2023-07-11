import { XMLParser } from 'fast-xml-parser'
import jsonpath from 'jsonpath'

import { Nfe } from '../../@types/Nfce'
import { InternalError } from '../../config/GenerateErros'

class GetNfceUseCase {
  handle(xmlContents: string): Nfe {
    const parser = new XMLParser()

    const nfce = parser.parse(xmlContents)

    const result = jsonpath.query(nfce, '$..NFe')

    if (!result.length) {
      throw new InternalError('NFe not found', 401)
    }

    return result[0] as Nfe
  }
}

export default new GetNfceUseCase()
