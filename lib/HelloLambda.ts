import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import sqs = require('@aws-cdk/aws-sqs');
import rds = require('@aws-cdk/aws-rds');
import { Duration } from '@aws-cdk/core';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';

export interface HelloLambdaProps {
    dbInstance: rds.IDatabaseInstance,
    queue: sqs.IQueue
}

export class HelloLambda extends cdk.Construct {

    public readonly handler: lambda.IFunction;

    constructor(scope: cdk.Construct, id: string, props: HelloLambdaProps){
        super(scope, id);

        this.handler = new lambda.Function(this, id, {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.asset('lambda'),
            handler: 'hello.handler',
            timeout: Duration.seconds(60),
            environment: {
                DATABASE_HOST: props.dbInstance.dbInstanceEndpointAddress
            }
        });
        //add permission to consume messages from the queue    
        this.handler.addEventSource(new SqsEventSource(props.queue));

    }
}