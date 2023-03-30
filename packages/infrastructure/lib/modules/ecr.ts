import { Stack } from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";

export const createEcr = (scope: Stack) => {
  const repository = new ecr.Repository(scope, "emoimoji-nest", {
    repositoryName: "emoimoji-nest",
  });
  return repository;
};
