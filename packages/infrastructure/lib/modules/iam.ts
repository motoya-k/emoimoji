import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'

export const createIam = (stack: cdk.Stack) => {
    const executionRole = new iam.Role(stack, `${stack.stackName}-ecs-task-execution-role`, {
        roleName: `${stack.stackName}-ecs-task-execution-role`,
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
        ],
    })

    const serviceRole = new iam.Role(stack, `${stack.stackName}-ecs-service-role`, {
        roleName: `${stack.stackName}-ecs-service-role`,
        assumedBy: new iam.ServicePrincipal('ecs.amazonaws.com'),
    })
        
    const serviceTaskRole = new iam.Role(stack, `${stack.stackName}-ecs-service-task-role`, {
        roleName: `${stack.stackName}-ecs-service-task-role`,
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    })

    return {
        executionRole,
        serviceRole,
        serviceTaskRole,
    }
}
