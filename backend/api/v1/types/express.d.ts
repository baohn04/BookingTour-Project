import { Request } from "express";

/**
 * Custom Request interface cho Admin routes.
 * Middleware `requireAuth` sẽ gán `user` và `role` vào request
 * sau khi xác thực JWT thành công.
 */
export interface AuthRequest extends Request {
  user?: Record<string, any>;
  role?: Record<string, any>;
}
