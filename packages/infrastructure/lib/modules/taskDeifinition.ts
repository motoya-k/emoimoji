import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Environment } from "../../types";

const envMap: Record<Environment, string> = {
  dev: 'development',
  stg: 'staging',
  prd: 'production',
}

type Props = {
  targetEnv: Environment;
  secret?: secretsmanager.Secret;
  roles: {
    execution: iam.Role;
    task: iam.Role;
  };
  specs?: {
    cpu: number;
    memory: number;
  };
  logGroup: logs.LogGroup;
};
export const createTaskDefinition = (stack: cdk.Stack, props: Props) => {
  const {
    targetEnv,
    secret,
    roles,
    specs = { cpu: 512, memory: 1024 },
    logGroup,
  } = props;
  const taskDefinition = new ecs.FargateTaskDefinition(
    stack,
    `${stack.stackName}-task-definition`,
    {
      cpu: specs.cpu,
      memoryLimitMiB: specs.memory,
      executionRole: roles.execution,
      taskRole: roles.task,
    }
  );
  new ecs.ContainerDefinition(stack, `${stack.stackName}-nest`, {
    containerName: "nest",
    taskDefinition,
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    // secrets: secret ? mapSecrets(secret, [
    //   "SAMPLE_SECRET_KEY",
    // ]) : undefined,
    environment: {
      NODE_ENV: envMap[targetEnv],
    },
    logging: ecs.LogDriver.awsLogs({
      streamPrefix: '/ecs/nest',
      logGroup: logGroup,
    }),
    portMappings: [
      {
        containerPort: 80,
      },
    ],
  });

  return { taskDefinition };
};

function mapSecrets(secret: secretsmanager.Secret, columns: string[] = []) {
  return columns.reduce((acc, envName) => {
    acc[envName] = ecs.Secret.fromSecretsManager(secret, envName);
    return acc;
  }, {} as { [key: string]: ecs.Secret });
}
