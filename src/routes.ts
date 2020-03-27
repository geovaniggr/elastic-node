import { Router } from 'express';
import ProdutoController from './controllers/ProdutoController';

const routes = Router();

routes.post('/', ProdutoController.store)
routes.get('/:nome', ProdutoController.index);

export default routes;