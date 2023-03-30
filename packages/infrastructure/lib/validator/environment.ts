import * as cdk from "aws-cdk-lib";
import { Environment } from "../../types";

const envs :Environment[] = [
    'dev',
    'stg',
    'prd',
]
export const environmentIsSet = (scope: cdk.App) => {
    const targetEnv: Environment = process.env.SYSTEM_ENV as Environment;
    if (envs.includes(targetEnv)) return []
    return ['You have to set a target environment.']
}
