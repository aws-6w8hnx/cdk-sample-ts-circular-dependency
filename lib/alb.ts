import * as cdk from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationListener, ApplicationLoadBalancer, ApplicationProtocol, ListenerAction, TargetGroupBase } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface vpcProps extends cdk.StackProps {
    readonly vpc: Vpc;
};

export class AlbStack extends cdk.Stack {
    readonly alb: ApplicationLoadBalancer;
    readonly listener: ApplicationListener;
  constructor(scope: Construct, id: string, props: vpcProps) {
    super(scope, id, props);

    this.alb = new ApplicationLoadBalancer (this, "alb", {
        vpc: props.vpc,
    }),

    this.listener = new ApplicationListener(this, 'listener', {
      loadBalancer: this.alb,
      protocol: ApplicationProtocol.HTTP,
      port: 80,
      defaultAction: ListenerAction.redirect({
        port:     '443',
        protocol: 'HTTPS',
        permanent: true,
      })
    })
  }
}
