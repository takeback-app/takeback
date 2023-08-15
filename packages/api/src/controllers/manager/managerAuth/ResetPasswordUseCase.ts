import { getRepository } from 'typeorm'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { InternalError } from '../../../config/GenerateErros'
import { TakeBackUsers } from '../../../database/models/TakeBackUsers'

interface Props {
  newPassword: string
  token: string
}

interface TokenProps {
  userId: string
  token: string
}

class ResetPasswordUseCase {
  async execute({ newPassword, token }: Props) {
    let userId: string
    let resetToken: string

    if (!newPassword || !token) {
      throw new InternalError('Dados incompletos', 400)
    }

    jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY,
      (err, decoded: TokenProps): TokenProps => {
        if (err) {
          throw new InternalError('Token inválido', 498)
        }

        userId = decoded.userId
        resetToken = decoded.token

        return decoded
      },
    )

    const user = await getRepository(TakeBackUsers).findOne({
      select: [
        'id',
        'isActive',
        'resetPasswordToken',
        'resetPasswordTokenExpiresDate',
      ],
      where: { id: userId, resetPasswordToken: resetToken },
    })

    if (!user) {
      throw new InternalError('Usuário não encontrado', 404)
    }

    if (!user.isActive) {
      throw new InternalError('Usuário inativo', 404)
    }

    if (user.resetPasswordToken !== resetToken) {
      throw new InternalError('Token expirado', 400)
    }

    const today = new Date()
    const expirateDate = new Date(user.resetPasswordTokenExpiresDate)

    if (today > expirateDate) {
      throw new InternalError('Token expirado', 400)
    }

    const passwordEncrypted = bcrypt.hashSync(newPassword, 10)

    const updatedUser = await getRepository(TakeBackUsers).update(user.id, {
      password: passwordEncrypted,
      resetPasswordToken: '',
      resetPasswordTokenExpiresDate: new Date(),
    })

    if (updatedUser.affected === 0) {
      throw new InternalError('Houve um erro inesperado!', 400)
    }

    return 'Senha atualizada'
  }
}

export { ResetPasswordUseCase }
