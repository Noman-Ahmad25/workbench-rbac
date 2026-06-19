import express, { type Response, type Request } from 'express';
import { RoleSchema } from '../../../shared/validators';
import { RoleService } from '../services/roleServices';
import { requirePermission } from '../middleware/auth';

// Best practice: Use express.Router() when separating routes into files
export const router = express.Router();

// Helper functions for consistent responses
const sendSuccess = (res: Response, data: any) => res.json({ success: true, data });
const sendError = (res: Response, status: number, error: string) => res.status(status).json({ success: false, error });

// 1. GET ALL ROLES (Open to view)
router.get('/api/roles', (req: Request, res: Response) => {
  sendSuccess(res, RoleService.getAll());
});

// 2. CREATE A ROLE (Protected by middleware)
// Syntax: router.post(path, middleware, handler)
router.post(
  '/api/roles', 
  requirePermission('Settings:update'), 
  (req: Request, res: Response) => {
    const result = RoleSchema.safeParse(req.body);
    
    if (!result.success) {
      return sendError(res, 400, result.error.errors[0].message);
    }
    
    sendSuccess(res, RoleService.create(result.data));
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