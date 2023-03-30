import * as cdk from "aws-cdk-lib";
import * as logs from "aws-cdk-lib/aws-logs";

export const createLogs = (stack: cdk.Stack) => {
  const ecsNestLogGroup = new logs.LogGroup(stack, `${stack.stackName}-ecs-nest`, {
    logGroupName: `/${stack.stackName}/ecs/nest`,
  });
  return { ecsNestLogGroup };
};
