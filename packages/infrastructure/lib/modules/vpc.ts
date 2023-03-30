import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

type NetworkProps = {};
export const createVpc = (stack: cdk.Stack, props: NetworkProps) => {
  const vpc = new ec2.Vpc(stack, `${stack.stackName}-vpc`, {
    // natGateways: 1,
    cidr: "10.0.0.0/16",
    maxAzs: 2,
    subnetConfiguration: [
      {
        cidrMask: 28,
        name: "rds",
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      {
        cidrMask: 24,
        name: "application",
        subnetType: ec2.SubnetType.PUBLIC,
      },
    ],
  });
  new cdk.CfnOutput(stack, `${stack.stackName}-vpc-id`, {
    value: vpc.vpcId,
    description: "The ID of the VPC",
    exportName: `${stack.stackName}-vpc-id`,
  });

  return { vpc };
};
