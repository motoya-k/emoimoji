import * as cdk from "aws-cdk-lib";
import { createEcr, createRoute53 } from "../modules";

type Props = {} & cdk.StackProps;

export class SharedStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: Props) {
    const { ...rest } = props;
    super(scope, id, rest);
    createRoute53(this);
    createEcr(this);
  }
}
