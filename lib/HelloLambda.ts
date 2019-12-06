import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import sqs = require('@aws-cdk/aws-sqs');


export interface MyLamddaProps {
    queue: sqs.IQueue;
    downstream: lambda.IFunction;
}


export class MyLambdaConstruct extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: MyLamddaProps){
        super(scope, id);

        props.queue.grantConsumeMessages(props.downstream);       


    }
}