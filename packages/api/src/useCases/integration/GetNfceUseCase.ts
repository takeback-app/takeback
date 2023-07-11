import { XMLParser } from 'fast-xml-parser'
import jsonpath from 'jsonpath'

import { Nfe } from '../../@types/Nfce'

class GetNfceUseCase {
  handle(xmlContents: string): Nfe {
    const parser = new XMLParser()

    const nfce = parser.parse(xmlContents)

    const result = jsonpath.query(nfce, '$..NFe')

    if (!result.length) {
      throw new Error('NFe not found')
    }

    return result[0] as Nfe
  }
}

export default new GetNfceUseCase()
