// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

export const requirePermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    // 1. Identify the user making the request (e.g., from a login token)
    const currentUserId = req.headers['x-user-id'] as string; 
    
    // 2. Resolve their permissions using our logic
    const userPermissions = UserService.resolveEffectivePermissions(currentUserId);

    // 3. Check if they have the right permission (or are an Admin)
    if (userPermissions?.includes(requiredPermission) || userPermissions?.includes('*.*')) {
      return next(); // Access Granted! Proceed to the route.
    }

    // 4. Access Denied
    return res.status(403).json({ error: "Forbidden: You do not have permission to do this." });
  };
};