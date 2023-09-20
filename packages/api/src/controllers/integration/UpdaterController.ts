import { Request, Response } from 'express'

class UpdaterController {
  async handle(request: Request, response: Response) {
    const { target, arch, currentVersion } = request.params

    console.log({ target, arch, currentVersion })

    return response.status(204).json()
  }

  async test(request: Request, response: Response) {
    const data = request.body

    console.log(data)

    return response.status(204).json()
  }
}

export default new UpdaterController()
