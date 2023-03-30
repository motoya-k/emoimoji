import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

type Props = {
    vpc: ec2.Vpc
}
export const createSSG = (stack: cdk.Stack, props: Props) => {
    const { vpc } = props
    const securityGroupLb = new ec2.SecurityGroup(stack, `${stack.stackName}-security-group-lb`, {
        vpc,
        description: 'Security group for load balancer',
        securityGroupName: `${stack.stackName}-sg-lb`,
    })
    securityGroupLb.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP traffic from the world')

    const securityGroupApplication = new ec2.SecurityGroup(stack, `${stack.stackName}-security-group-application`, {
        vpc,
        description: 'Security group for application',
        securityGroupName: `${stack.stackName}-sg-application`,
    })
    securityGroupApplication.addIngressRule(securityGroupLb, ec2.Port.tcp(80), 'Allow HTTP traffic from the LB')

    const securityGroupDb = new ec2.SecurityGroup(stack, `${stack.stackName}-sg-db`, {
        vpc,
        allowAllOutbound: true,
        securityGroupName: `${stack.stackName}-sg-db`,
    });
    securityGroupDb.addIngressRule(securityGroupApplication, ec2.Port.tcp(5432))

    return {
        securityGroupDb,
        securityGroupLb,
        securityGroupApplication,
    }
}
