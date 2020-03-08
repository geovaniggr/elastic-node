import { Request, Response }  from 'express';
import { client, index} from '../config/elastic';


interface User {
    _source: object
}

export default {


    async index(req: Request, res: Response){

        const { nome } = req.query;
        if(!nome) res.sendStatus(400);

        const { body } = await client.search({
            index,
            body: {
                query: {
                    match: { nome }
                }
            }
        })

        const sanitize: User[]  = body.hits.hits;

        sanitize.map( user => console.log(user._source));
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