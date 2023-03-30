import * as cdk from "aws-cdk-lib";
import * as route53 from "aws-cdk-lib/aws-route53";

export const createRoute53 = (stack: cdk.Stack): void => {
  new route53.PublicHostedZone(stack, "emoimoji-com", {
    zoneName: "emoimoji.com",
    comment: "created by Gandi.net",
  });
};
