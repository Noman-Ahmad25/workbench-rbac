import express, { type Response, type Request  } from 'express';
import cors from 'cors';
import { router as roles } from './routes/rolesRouter';
import {router as users} from './routes/userRouter'


const sendSuccess = (res: Response, data: any) => res.json({ success: true, data });

export const app = express();
app.use(cors());
app.use(express.json());

app.use(users);
app.use(roles);

app.get('/', (req: Request, res: Response) => sendSuccess(res, {"message": "workbenchRoleSystem is working properly"}))

