import cdk = require('@aws-cdk/core');
import sqs = require('@aws-cdk/aws-sqs');
import lambda = require('@aws-cdk/aws-lambda');
import { NotifyingBucket } from './notifyingbucket';
import { SqsSubscription } from '@aws-cdk/aws-sns-subscriptions';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Duration } from '@aws-cdk/core';

export class App01Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const queue = new sqs.Queue(this, 'MySqsBucketQueue',{
      visibilityTimeout: Duration.seconds(20),
      receiveMessageWaitTime: Duration.seconds(5)
    });

    const helloHandler = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.asset('lambda'),
      handler: 'hello.handler'
    });    
    helloHandler.addEventSource(new SqsEventSource(queue));

    const bucket = new NotifyingBucket(this, 'NotifyingBucket', {
      bucketName: 'mytestnotifyingbucket1934u31u4',
      reader: helloHandler
    });
    const subscription = new SqsSubscription(queue);
    bucket.snsTopic.addSubscription(subscription); 

  }
}
