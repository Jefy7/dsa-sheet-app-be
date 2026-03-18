import { AuthService } from '../../services/auth.service';

describe('AuthService', () => {
  it('should be defined', () => {
    const service = new AuthService();
    expect(service).toBeDefined();
  });
});
