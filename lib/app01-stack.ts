import cdk = require('@aws-cdk/core');
import sqs = require('@aws-cdk/aws-sqs');
import { NotifyingBucket } from './notifyingbucket';
import { SqsSubscription } from '@aws-cdk/aws-sns-subscriptions';

export class App01Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const queue = new sqs.Queue(this, 'MySqsBucketQueue');

    const bucket = new NotifyingBucket(this, 'MyTestNotifyingBucket', {
      bucketName: 'mytestnotifyingbucket1934u31u4'
    });

    const subscription = new SqsSubscription(queue);

    bucket.snsTopic.addSubscription(subscription);
  }
}
