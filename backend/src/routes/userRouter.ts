import express, { type Request, type Response } from 'express';
import { UserRoleAssignmentSchema } from '../../../shared/validators';
import { UserService } from '../services/userService';
import { sendSuccess, sendError } from '../utils/response'; // 1. Clean utility import
import { requirePermission } from '../middleware/auth'; // 2. Import your RBAC middleware

// 3. Best Practice: Use express.Router() instead of express() for isolated routing
export const router = express.Router();

// GET ALL USERS (Open to view)
router.get('/api/users', (req: Request, res: Response) => {
  sendSuccess(res, UserService.getAll());
});

// ASSIGN ROLES TO USER (Protected route)
router.put(
  '/api/users/:id/roles', 
  requirePermission('Members:update role'), // 4. Protected! Only users with this permission can assign roles
  (req: Request, res: Response) => {
    const result = UserRoleAssignmentSchema.safeParse(req.body);
    
    if (!result.success) {
      return sendError(res, 400, "Invalid role data");
    }

    const updated = UserService.assignRoles(req.params.id, result.data.roleIds);
    return updated ? sendSuccess(res, updated) : sendError(res, 404, 'User not found');
  }
);

// GET USER'S EFFECTIVE PERMISSIONS
router.get('/api/users/:id/permissions', (req: Request, res: Response) => {
  if (typeof req.params.id !== 'string') {
    return sendError(res, 400, 'Invalid user ID'); // 5. Fixed typo: "role ID" -> "user ID"
  }
  
  const perms = UserService.resolveEffectivePermissions(req.params.id);
  return perms ? sendSuccess(res, perms) : sendError(res, 404, 'User not found');
});