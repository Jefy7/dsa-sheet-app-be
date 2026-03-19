export interface IUserPayload {
  userId: string;
  email: string;
}

export interface IRefreshTokenPayload extends IUserPayload {
  tokenVersion: number;
}
