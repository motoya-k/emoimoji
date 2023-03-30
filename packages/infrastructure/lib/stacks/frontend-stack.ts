import * as cdk from "aws-cdk-lib";
import { createValidator, environmentIsSet } from '../validator'
import { createFrontendS3 } from '../modules'

type Props = {} & cdk.StackProps;

export class FrontendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: Props) {
    const { ...rest } = props;
    super(scope, id, rest);

    this.node.addValidation({
        validate: createValidator(scope, environmentIsSet) 
    })

    createFrontendS3(this) 
  }
}
