import * as cdk from 'aws-cdk-lib'

export const createValidator = (scope: cdk.App,...funcs: ((scope: cdk.App, ...args: any[]) => string[])[]): () => string[] => {
    return () => funcs.flatMap((func) => func(scope))
}