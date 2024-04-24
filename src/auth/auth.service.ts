import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user._id.toString(),
      role: user.userType,
    };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user._id.toString(),
      userRole: user.userType,
    };
  }
}
