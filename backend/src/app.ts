import express, { type Response, type Request  } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router as roles } from './routes/rolesRouter';
import {router as users} from './routes/userRouter'
import { sendSuccess } from './utils/response';



export const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(users);
app.use(roles);

app.get('/', (req: Request, res: Response) => sendSuccess(res, {"message": "workbenchRoleSystem is working properly"}))
