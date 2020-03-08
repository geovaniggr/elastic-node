import { Request, Response } from 'express';
import { client, index } from '../config/elastic';

export default {
    async indexData(req: Request, res: Response){
        const data = await client.indices.getMapping({index});
        const {catalogo} = data.body;

        const {catalogo: {mappings: {properties}}} = data.body;

        const {nome} = properties;

        console.log(nome.fields)


        //console.log(properties)

        res.sendStatus(200);
    },

    async generateAutoComplete(req: Request, res: Response) {
        await client.indices.putSettings({
            index,
            body: {
                settings: {
                    analysis:{
                        filter: {
                            portuguese_autocomplete: {
                                type: 'edge-ngram',
                                min_gram: 3,
                                max_gram: 20
                            }
                        },
                    },
                    analyzer: {
                        autocomplete: {
                            type: 'custom',
                            tokenizer: 'standart',
                            filter: ['lowercase', 'portuguese_autocomplete']
                        }
                    }
                }
            }
        }).catch(console.log);
    }
}