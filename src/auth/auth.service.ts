import { UsersService } from '../users/users.service';
import { User } from '../users/schema/users.schema';
import { RegisterDTO } from './dto/register.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user._id.toString(),
      username: user.username,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(user: RegisterDTO) {
    user.password = await hash(user.password, 10);
    const userCreated = await this.usersService.create(user);
    return this.login(userCreated);
  }
}
