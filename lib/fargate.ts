import * as cdk from 'aws-cdk-lib';
import { Port, Vpc, } from 'aws-cdk-lib/aws-ec2';
import { AppProtocol, Cluster, Compatibility, ContainerImage, FargateService, PortMap, Protocol, TaskDefinition } from 'aws-cdk-lib/aws-ecs';

import { ApplicationListener, ApplicationLoadBalancer, ApplicationProtocol, ApplicationTargetGroup, } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface vpcProps extends cdk.StackProps {
  readonly vpc: Vpc;
  readonly alb: ApplicationLoadBalancer;
  readonly listener: ApplicationListener;
};

export class FargateStack extends cdk.Stack {
  readonly cluster: Cluster;
  readonly taskDefinition: TaskDefinition;
  readonly fargateService: FargateService;

  constructor(scope: Construct, id: string, props: vpcProps) {
    super(scope, id, props);

    this.cluster = new Cluster(this, 'cluster', {
      vpc: props.vpc,
      enableFargateCapacityProviders: true,
      containerInsights: true
    })

    this.taskDefinition = new TaskDefinition(this, 'task-definition', {
      compatibility:  Compatibility.FARGATE,
      cpu: "512",
      memoryMiB: "1024"
    })

    this.taskDefinition.addContainer('container', {
      image: ContainerImage.fromRegistry('amazon/aws-otel-collector'),
      portMappings: [ {
        containerPort: 80,
        appProtocol: AppProtocol.http,
        protocol: Protocol.TCP,
        name: 'mapping'
      }
      ]
    })

    this.fargateService = new FargateService(this, 'fargate-service', {
      taskDefinition: this.taskDefinition,
      cluster: this.cluster
    })

    props.listener.addTargets('container-listener', {
      protocol: ApplicationProtocol.HTTP,
      port: 80,
      targets: [
        this.fargateService.loadBalancerTarget({
          containerName: this.taskDefinition.defaultContainer!.containerName,
          containerPort: 80
        })
      ]
    })

    this.fargateService.connections.allowFrom(props.alb, Port.HTTP)
  }
}
