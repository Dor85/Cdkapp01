import { Construct } from "@aws-cdk/core";
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import notifications = require('@aws-cdk/aws-s3-notifications');

export interface NotifyingBucketProps {
    prefix?: string;
    bucketName: string;
}

export class NotifyingBucket extends Construct {
    
    public readonly snsTopic: sns.Topic;

    constructor(scope: Construct, id: string, props: NotifyingBucketProps){
        super(scope, id);

        const bucket = new s3.Bucket(this, props.bucketName, {
            bucketName: props.bucketName
        });

        this.snsTopic = new sns.Topic(this, 'notifybucketsnstopic');
        
        
        const destination = new notifications.SnsDestination(this.snsTopic);
        
        bucket.addObjectCreatedNotification(destination);

    }
}