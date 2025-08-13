import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email)

      if (user && (await user.validatePassword(password))) {
        const { password: _, ...result } = user
        return result
      }
    } catch (_error) {
      return null
    }

    return null
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    })

    await this.usersService.updateRefreshToken(user.id, refreshToken)

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto)
    return this.login(user)
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      })

      const user = await this.usersService.findOne(payload.sub)

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      return this.login(user)
    } catch (_error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null)
    return { message: 'Logged out successfully' }
  }
}
