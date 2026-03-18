import { StatusCodes } from 'http-status-codes';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { ApiError } from '../errors/ApiError';
import { IUserPayload } from '../interfaces/auth.interface';
import { UserRepository } from '../repositories/user.repository';
import { comparePassword, hashPassword } from '../utils/password';
import { signJwt } from '../utils/jwt';

export class AuthService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async register(payload: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(payload.email.toLowerCase());
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email is already registered');
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await this.userRepository.save({
      name: payload.name,
      email: payload.email.toLowerCase(),
      passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async login(payload: LoginDto) {
    const user = await this.userRepository.findByEmail(payload.email.toLowerCase());
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const isMatch = await comparePassword(payload.password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const jwtPayload: IUserPayload = { userId: user.id, email: user.email };
    const token = signJwt(jwtPayload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async me(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
