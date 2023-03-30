import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

type KVSProps = {};

export const createDynamoDB = (stack: cdk.Stack, props: KVSProps) => {
  const kvsTable = new dynamodb.Table(stack, "ddbTable", {
    partitionKey: {
      name: "tenantId",
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: "timestamp",
      type: dynamodb.AttributeType.NUMBER,
    },
    tableName: stack.stackName,
    readCapacity: 1,
    writeCapacity: 1,
  });
  return { kvsTable };
};
