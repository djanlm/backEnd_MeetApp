import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetUpController from './app/controllers/MeetUpController';
import HostController from './app/controllers/HostController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/meetups', MeetUpController.store);
routes.put('/meetups/:id', MeetUpController.update);
routes.delete('/meetups/:id', MeetUpController.delete);

routes.get('/mymeetups', HostController.index);
// route to upload files
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
