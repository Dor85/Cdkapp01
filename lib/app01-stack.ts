import cdk = require('@aws-cdk/core');
import sqs = require('@aws-cdk/aws-sqs');
import lambda = require('@aws-cdk/aws-lambda');
import rds = require('@aws-cdk/aws-rds');
import ec2 = require('@aws-cdk/aws-ec2');
import { NotifyingBucket } from './notifyingbucket';
import { SqsSubscription } from '@aws-cdk/aws-sns-subscriptions';
import { Duration, SecretValue } from '@aws-cdk/core';
import { HelloLambda } from './HelloLambda';

export class App01Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    
    //This import your existing VPC (account default)
    const vpc = ec2.Vpc.fromLookup(this, 'MyVpcLookUp', {
      isDefault: true,
      vpcId: 'vpc-37a5324d',
      vpcName: 'aws-default',
    });
    
    //create an rds instance with a database named testdb.
    const dbInstance = new rds.DatabaseInstance(this, 'MyTestDb', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      masterUsername: 'sysCdk',
      masterUserPassword: SecretValue.plainText('sysCdksysCdk'),
      databaseName: 'testdb',
      vpc,
    });
    
    //create a queue
    const queue = new sqs.Queue(this, 'MySqsBucketQueue',{
      visibilityTimeout: Duration.seconds(120),
      receiveMessageWaitTime: Duration.seconds(5)
    });

    // create a lambda function
    const helloHandler = new HelloLambda(this, 'HelloHandler', {
      dbInstance,
      queue
    });
    
    
    //crate an s3 bucket with notification configuration and a define function to allow to read files.
    const bucket = new NotifyingBucket(this, 'NotifyingBucket', {
      bucketName: 'mytestnotifyingbucket1934u31u4',
      reader: helloHandler.handler
    });
    // create a subscription from the queue to the s3 bucket
    const subscription = new SqsSubscription(queue);
    bucket.snsTopic.addSubscription(subscription); 

  }
}
