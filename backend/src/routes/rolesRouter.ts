import express, { type Request, type Response } from 'express';
import { RoleSchema } from '../../../shared/validators';
import { RoleService } from '../services/roleServices';
import { requirePermission } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';

export const router = express.Router();

// 1. GET ALL ROLES (Open to view)
router.get('/api/roles', (req: Request, res: Response) => {
  sendSuccess(res, RoleService.getAll());
});

// 2. CREATE A ROLE (Protected by middleware)
router.post(
  '/api/roles', 
  requirePermission('Settings:update'), 
  (req: Request, res: Response) => {
    const result = RoleSchema.safeParse(req.body);
    
    if (!result.success) {
      return sendError(res, 400, result.error.errors[0].message);
    }
    
    // Status 201 indicates a resource was successfully created
    sendSuccess(res, RoleService.create(result.data), 201); 
  }
);

// 3. UPDATE A ROLE (Protected by middleware)
router.put(
  '/api/roles/:id', 
  requirePermission('Settings:update'), 
  (req: Request, res: Response) => {
    if (typeof req.params.id !== 'string') {
      return sendError(res, 400, 'Invalid role ID');
    }
    
    const result = RoleSchema.safeParse(req.body);
    
    if (!result.success) {
      return sendError(res, 400, result.error.errors[0].message);
    }
    
    const updated = RoleService.update(req.params.id, result.data);
    return updated ? sendSuccess(res, updated) : sendError(res, 404, 'Role not found');
  }
);