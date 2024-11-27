import * as cdk from 'aws-cdk-lib';
import { AmazonLinuxGeneration, AmazonLinuxImage, Instance, InstanceClass, InstanceSize, InstanceType, Port, Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface vpcProps extends cdk.StackProps {
    readonly vpc: Vpc;
    readonly alb: ApplicationLoadBalancer;
};

export class Ec2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: vpcProps) {
    super(scope, id, props);

    const instance = new Instance (this, 'ec2', {
        vpc: props.vpc,
        instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO),
        machineImage: new AmazonLinuxImage({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2023}),
    })

    instance.connections.allowFrom(props.alb, Port.HTTP)
  }
}
