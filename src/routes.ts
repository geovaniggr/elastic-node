import { Router } from 'express';
import ProdutoController from './controllers/ProdutoController';
import ElasticController from './controllers/ElasticController';

const routes = Router();

routes.post('/', ProdutoController.store)
routes.get('/:nome', ProdutoController.index);

routes.get('/config/clusterdata', ElasticController.indexData)
routes.get('/config/setFilter', ElasticController.generateAutoComplete)

export default routes;