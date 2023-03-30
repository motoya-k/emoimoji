import * as cdk from "aws-cdk-lib";
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { createVpc } from "../modules";

type Props = {} & cdk.StackProps;
export class NetworkStack extends cdk.Stack {

  public vpc: ec2.Vpc

  constructor(scope: cdk.App, id: string, props: Props) {
    const { ...rest } = props;
    super(scope, id, rest);
    const { vpc } = createVpc(this, {});
    this.vpc = vpc
  }
}
