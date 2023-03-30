import * as cdk from "aws-cdk-lib";
import { RemovalPolicy } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as iam from 'aws-cdk-lib/aws-iam'
import path = require("path");

type CreateBucketWithCloudfrontProps = {
  bucketName: string
}
export const createBucketWithCloudfront = (stack: cdk.Stack, props: CreateBucketWithCloudfrontProps) => {
  const { bucketName } = props
  const bucket = new s3.Bucket(stack, `${bucketName}-bucket`, {
    bucketName,
    removalPolicy: RemovalPolicy.DESTROY,
  });
  const oai = new cloudfront.OriginAccessIdentity(
      stack,
      `${bucketName}-origin-access-identity`,
    );
  bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        effect: iam.Effect.ALLOW,
        principals: [
          new iam.CanonicalUserPrincipal(
            oai.cloudFrontOriginAccessIdentityS3CanonicalUserId,
          ),
        ],
        resources: [`${bucket.bucketArn}/*`],
      }),
    );
  const distribution = new cloudfront.Distribution(stack, `${bucketName}-distribution`, {
      comment: `distribution for ${bucketName}`,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new cloudfrontOrigins.S3Origin(bucket)
      },
      errorResponses:  [
        {
          ttl: cdk.Duration.seconds(300),
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: '/error.html',
        },
        {
          ttl: cdk.Duration.seconds(300),
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/error.html',
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
    });
  new s3deploy.BucketDeployment(stack, `${bucketName}-bucket-deploy`, {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, './source')),
      ],
      destinationBucket: bucket,
      distribution: distribution,
      distributionPaths: ['/*'],
    });
  return bucket
}
