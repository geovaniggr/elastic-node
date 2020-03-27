import { Request, Response }  from 'express';
import { RequestParams, ApiResponse } from '@elastic/elasticsearch';
import { client, index} from '../config/elastic';
import { SearchResponse } from '../interfaces/Elastic';

interface Source {
    nome: string,
    categoria: string
}

export default {
    async index(req: Request, res: Response){

        const { nome } = req.query;
        if(!nome) res.sendStatus(400);

        const { body }: ApiResponse<SearchResponse<Source>> = await client.search({
            index,
            body: {
                query: {
                    match: { "nome.autocomplete": nome }
                }
            }
        })

        const sanitize  = body.hits.hits;
        console.log(sanitize);

        sanitize.map( user => console.log(user._source.categoria));
        res.sendStatus(400);
    },
    async store(req: Request, res: Response){
        const { nome, categoria} = req.body;

        const resp = await client.index({
            index,
            body: {
                nome,
                categoria,
            }
        })

        res.json({nome, categoria});
    }
}