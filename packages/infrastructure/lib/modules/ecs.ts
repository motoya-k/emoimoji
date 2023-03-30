import * as cdk from "aws-cdk-lib";
import * as lb from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as iam from 'aws-cdk-lib/aws-iam'
import * as logs from "aws-cdk-lib/aws-logs";
import * as secretmanager from "aws-cdk-lib/aws-secretsmanager";
import { Environment } from "../../types";
import { createTaskDefinition } from "./taskDeifinition";

type Props = {
  targetEnv: Environment;
  vpc: ec2.Vpc;
  sg: ec2.SecurityGroup
  targetGroup: lb.ApplicationTargetGroup
  roles: {
    execution: iam.Role;
    task: iam.Role;
  };
  logGroup: logs.LogGroup;
  secrets: {
    base: secretmanager.Secret
  } 
};
export const createEcs = (stack: cdk.Stack, props: Props) => {
  const { targetEnv, sg, vpc, targetGroup, logGroup, roles: { execution, task }, secrets: { base } } = props;
  const clusterName = `${stack.stackName}-cluster`;
  const cluster = new ecs.Cluster(stack, clusterName, { vpc, clusterName });

  const { taskDefinition } = createTaskDefinition(stack, {
    targetEnv,
    roles: {
      execution,
      task,
    },
    secret: base,
    logGroup,
  })

  const fargate = new ecs.FargateService(stack, `${stack.stackName}-service-definition`, {
    serviceName: `${stack.stackName}-service-definition`,
    cluster,
    vpcSubnets: vpc.selectSubnets({ subnetGroupName: 'application' }),
    taskDefinition,
    securityGroups: [sg],
    desiredCount: 1,
    maxHealthyPercent: 100,
    minHealthyPercent: 50,
  })
  targetGroup.addTarget(fargate.loadBalancerTarget({
    containerName: taskDefinition.defaultContainer!.containerName,
    containerPort: taskDefinition.defaultContainer!.containerPort,
  }))
};
