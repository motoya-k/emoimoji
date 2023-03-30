import * as secretmanager from "aws-cdk-lib/aws-secretsmanager";
import * as cdk from "aws-cdk-lib";

export const createSSM = (stack: cdk.Stack) => {
  const secret = new secretmanager.Secret(stack, `${stack.stackName}-secret`, {
    secretName: `${stack.stackName}-secret`,
    generateSecretString: {
      secretStringTemplate: JSON.stringify({
        SAMPLE_SECRET_KEY: "sample value",
      }),
      generateStringKey: "password",
    },
  });
  return { secret };
};
