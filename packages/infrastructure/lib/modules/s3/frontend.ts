import * as cdk from "aws-cdk-lib";
import { createBucketWithCloudfront } from "../cloudfront";

export const createFrontendS3 = (stack: cdk.Stack) => {
  const user = createBucketWithCloudfront(stack, { bucketName: `${stack.stackName}-user-frontend` })
  const admin = createBucketWithCloudfront(stack, { bucketName: `${stack.stackName}-admin-frontend` })
  return { user, admin };
};
