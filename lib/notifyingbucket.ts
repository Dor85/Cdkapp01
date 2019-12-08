import { Construct, CfnResource, RemovalPolicy } from "@aws-cdk/core";
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import lambda = require('@aws-cdk/aws-lambda');
import notifications = require('@aws-cdk/aws-s3-notifications');

export interface NotifyingBucketProps {
    prefix?: string;
    bucketName: string;
    reader: lambda.IFunction;
}

export class NotifyingBucket extends Construct {
    
    public readonly snsTopic: sns.Topic;

    constructor(scope: Construct, id: string, props: NotifyingBucketProps){
        super(scope, id);

        const bucket = new s3.Bucket(this, props.bucketName, {
            bucketName: props.bucketName,
            removalPolicy: RemovalPolicy.DESTROY
        });

        this.snsTopic = new sns.Topic(this, 'notifybucketsnstopic');
        
        
        const destination = new notifications.SnsDestination(this.snsTopic);
        
        bucket.addObjectCreatedNotification(destination);
        bucket.grantRead(props.reader);
        bucket.grantPublicAccess();

    }
}