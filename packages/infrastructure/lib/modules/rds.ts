import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";

type DatabaseProps = {
  sg: ec2.SecurityGroup
  vpc: ec2.Vpc;
};

export const createRDS = (stack: cdk.Stack, props: DatabaseProps) => {
  const { vpc, sg } = props;

  const userName = "postgres";
  const secretName = `${stack.stackName}-database-secrets`;
  const credentials = rds.Credentials.fromGeneratedSecret(userName, {
    secretName,
  });

  const database = new rds.DatabaseCluster(stack, `${stack.stackName}-database-cluster`, {
    engine: rds.DatabaseClusterEngine.auroraPostgres({
      version: rds.AuroraPostgresEngineVersion.VER_13_4,
    }),
    clusterIdentifier: stack.stackName,
    instances: 1,
    defaultDatabaseName: "emoimoji",
    storageEncrypted: true,
    instanceProps: {
      vpc,
      publiclyAccessible: true,
      vpcSubnets: vpc.selectSubnets({
        subnetGroupName: 'rds'
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      securityGroups: [sg],
    },
    credentials,
  });

  return { database, credentials };
};
