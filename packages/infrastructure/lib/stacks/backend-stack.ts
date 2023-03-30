import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2"
import { Environment } from "../../types";
import {
  createSSG,
  createLb,
  createLogs,
  createIam,
  createEcs,
  createSSM,
  createRDS,
} from "../modules";

type Props = {
  targetEnv: Environment
  vpc: ec2.Vpc
} & cdk.StackProps;
export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: Props) {
    const { vpc, targetEnv, ...rest } = props
    super(scope, id, rest);

    const { securityGroupDb, securityGroupApplication, securityGroupLb } = createSSG(this, { vpc })
    const { targetGroup } = createLb(this, { vpc, sg: securityGroupLb })

    const { ecsNestLogGroup } = createLogs(this)
    const { executionRole, serviceTaskRole } = createIam(this)
    const { secret } = createSSM(this);

    // createEcs(this, {
    //   targetEnv,
    //   vpc,
    //   targetGroup,
    //   sg: securityGroupApplication,
    //   roles: {
    //     execution: executionRole,
    //     task: serviceTaskRole,
    //   },
    //   logGroup: ecsNestLogGroup,
    //   secrets: {
    //     base: secret
    //   }
    // })
    // createRDS(this, {
    //   vpc,
    //   sg: securityGroupDb,
    // });
  }
}
