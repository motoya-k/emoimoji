import * as cdk from 'aws-cdk-lib'
import * as lb from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

type Props = {
    vpc: ec2.Vpc,
    sg: ec2.SecurityGroup
}
export const createLb = (stack: cdk.Stack, props: Props) => {
  const { vpc, sg } = props
  const { 
    alb,
    targetGroup
  } = createLbAndTargetGroup({
    stack,
    vpc,
    sg,
    name: `${stack.stackName}`
  })
  return { 
    alb,
    targetGroup
  }
}

type CreateLbAndListenerProps = {
    stack: cdk.Stack,
    vpc: ec2.Vpc,
    sg: ec2.SecurityGroup,
    name: string
}
const createLbAndTargetGroup = (props: CreateLbAndListenerProps) => {
  const { stack, vpc, sg, name } = props
  const alb = new lb.ApplicationLoadBalancer(stack, `${name}-alb`, {
    vpc,
    securityGroup: sg,
    internetFacing: true,
    loadBalancerName: `${name}-alb`
  })
  const listener = alb.addListener(`${name}-alb-listener`, {
    port: 80,
    open: true,
  })
    const targetGroup = new lb.ApplicationTargetGroup(stack, `${name}-target-group`, {
      vpc,
      port: 80,
      protocol: lb.ApplicationProtocol.HTTP,
      targetType: lb.TargetType.INSTANCE,
      healthCheck: {
        path: '/',
        interval: cdk.Duration.seconds(60),
        healthyHttpCodes: '200'
      },
    })
    listener.addTargetGroups(`${name}-target-group`, {
      targetGroups: [targetGroup],
    })
  return { 
    alb, 
    targetGroup
  }
}
