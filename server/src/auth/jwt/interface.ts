export interface JwtPayload {
  id: number;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}
