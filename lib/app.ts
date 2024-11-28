#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc';
import { AlbStack } from '../lib/alb';
import { Ec2Stack } from '../lib/ec2';

const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
const app = new cdk.App();

const vpc = new VpcStack(app, `vpc-stack`, {
  env: env,
});

const alb = new AlbStack(app, `alb-stack`, {
  env: env,
  vpc: vpc.vpc,
});

const ec2 = new Ec2Stack(app, `ec2-stack`, {
  env: env,
  vpc: vpc.vpc,
  alb: alb.alb,
  listener: alb.listener,
});