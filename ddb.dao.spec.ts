import { DynamoDBDAO } from './ddb.dao';
// import { testBusinessModel } from '@hawryschuk/redaction/business.model.spec.exports';
// testBusinessModel({
//     title: 'Business Model : DynamoDB',
//     business: new BusinessModel(DynamoDBDAO)
// });

import { testDAO, SampleDAO } from '@hawryschuk/dao/DAO.spec.exports';

testDAO({
    title: 'SQLite DAO',
    dao: new DynamoDBDAO(SampleDAO.models) as any,
})
