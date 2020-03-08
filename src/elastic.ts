import { Client } from '@elastic/elasticsearch';

const client = new Client({node: 'http://localhost:9200'});


function createIndex() {
    return client.indices.create({
        index: "catalogo",
        body: {
            settings: {
                index: {
                    number_of_shards: 1,
                    number_of_replicas: 0
                }
            }}
    });
}

function checkStatus() {
    return client.cluster.health({
        index: "catalogo"
    })
}

function putMapping() {
    return client.indices.putMapping({
        index: "catalogo",
        body: {
            properties: {
                nome: {
                    type: "text",
                    analyzer: "portuguese",
                    fields: {
                        original: { type: "keyword" },
                        autocomplete: { type: "text", analyzer: "portuguese"}
                    }
                },
                categoria: {
                    type: "text",
                    analyzer: "portuguese",
                    fields: { original: { type: "keyword"}}
                }

            }
        }
    })
}


function putFilter(){
    return client.ml.putFilter({
        filter_id: "filtro_autocomplete",
        body: {
            type: "edge_ngram",
            min_gram: 3,
            max_gram: 20
        }
    })
}

function putSettings(){
    return client.indices.putSettings({
        index: "catalogo",
        body: {
            settings: {
                analysis: {
                    analyzer: {
                        autocomplete: {
                            tokenizer: "standart",
                            filter: ["portuguese", "filtro_autocomplete"]
                        },
                        filter: {
                            filtro_autocomplete: {
                                type: "edge_ngram",
                               min_gram: 3,
                               max_gram: 20,
                        }},
                    }
                }
            }
        }
    })
}

async function run() {

    //await putMapping();
    //await putFilter();
    await putSettings();

    const data = await client.indices.getMapping({index: "catalogo"});

    console.log(data);


}

run().catch(console.log);