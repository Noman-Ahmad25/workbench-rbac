import express, { type Response, type Request  } from 'express';
import { UserRoleAssignmentSchema } from '../../../shared/validators';
import { UserService } from '../services/userService';

const sendSuccess = (res: Response, data: any) => res.json({ success: true, data });
const sendError = (res: Response, status: number, error: string) => res.status(status).json({ success: false, error });

export const router = express();
router.get('/api/users', (req: Request, res: Response) => sendSuccess(res, UserService.getAll()));
router.put('/api/users/:id/roles', (req, res) => {
  const result = UserRoleAssignmentSchema.safeParse(req.body);
  if (!result.success) return sendError(res, 400, "Invalid role data");

  const updated = UserService.assignRoles(req.params.id, result.data.roleIds);
  return updated ? sendSuccess(res, updated) : sendError(res, 404, 'User not found');
});
router.get('/api/users/:id/permissions', (req: Request, res: Response) => {

  if (typeof req.params.id !== 'string') {
    return sendError(res, 400, 'Invalid role ID');
  }
  const perms = UserService.resolveEffectivePermissions(req.params.id);
  return perms ? sendSuccess(res, perms) : sendError(res, 404, 'User not found');
});

