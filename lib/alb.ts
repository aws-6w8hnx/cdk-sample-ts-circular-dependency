import * as cdk from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface vpcProps extends cdk.StackProps {
    readonly vpc: Vpc;
};

export class AlbStack extends cdk.Stack {
    readonly alb: ApplicationLoadBalancer;
  constructor(scope: Construct, id: string, props: vpcProps) {
    super(scope, id, props);

    this.alb = new ApplicationLoadBalancer (this, "alb", {
        vpc: props.vpc,
    })

  }
}
