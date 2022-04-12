import { Util } from '@hawryschuk/common';
import { DAO, Model } from '@hawryschuk/dao';
import * as AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });

export class DynamoDBDAO extends DAO {
    client = new AWS.DynamoDB.DocumentClient();

    constructor(models: any) { super(models); }

    ready$ = Promise
        .resolve(true)
        .then(() => new AWS.DynamoDB().listTables().promise())
        .then(async ({ TableNames }) => {
            for (let TableName of Object.keys(this.models).filter(table => !TableNames.includes(table))) {
                const p = await new AWS.DynamoDB().createTable({
                    TableName,
                    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
                    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
                    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
                }).promise();
            }
        })
        .then(() => new Date);

    async create<M extends Model>(klass: any, data: M): Promise<M> {
        const object = await super.create(klass, data);
        await this.client.put({ TableName: klass.name, Item: object.POJO() }).promise();
        return object;
    }
    async delete(klass: any, id: string, fromObject?: boolean) {
        const object = await super.delete(klass, id, fromObject, true);
        await this.client.delete({ TableName: klass.name, Key: { id } }).promise();
        return object;
    }
    async update<M extends Model>(klass: any, id: string, data: any): Promise<M> {
        const object: M = await super.update(klass, id, data);
        await this.client.put({ TableName: klass.name, Item: object.POJO() }).promise();
        return object;
    }
    async getOnline(klass: any, id = '', from = ''): Promise<Model | { [id: string]: Model }> {
        const doc2obj = async (doc: any): Promise<Model> => {
            const obj: Model = doc && new klass({ ...doc });
            obj && await obj.ready$;
            return obj;
        };
        const online = id
            ? await this
                .client.get({ TableName: klass.name, Key: { id } }).promise()
                .then(r => doc2obj(r.Item))
            : await this
                .client.scan({ TableName: klass.name }).promise()
                .then(r => Promise.all(r.Items.map(doc2obj)))
                .then(models => models.reduce((all, model) => ({
                    ...all, [model.id]: model
                }), {}))
            ;
        return online;
    }
}
