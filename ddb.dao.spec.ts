import { DynamoDBDAO } from './ddb.dao';
import { BusinessModel } from '@hawryschuk/redaction';
import { testBusinessModel } from '@hawryschuk/redaction/business.model.spec.exports';

testBusinessModel({
    title: 'Business Model : DynamoDB',
    business: new BusinessModel(DynamoDBDAO)
});
