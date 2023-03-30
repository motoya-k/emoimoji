#!/usr/bin/env node
import * as cdk from "aws-cdk-lib"
import { SharedStack, BackendStack, FrontendStack, NetworkStack } from "../lib/stacks"
import { Environment } from "../types"
import { Constant } from './constants'

const app = new cdk.App()
const targetEnv: Environment = process.env.SYSTEM_ENV as Environment

new SharedStack(app, `${Constant.GENERAL.APP_NAME}-shared`, {})
const network = new NetworkStack(app, `${Constant.GENERAL.APP_NAME}-network`, {})
new BackendStack(app, `${targetEnv}-${Constant.GENERAL.APP_NAME}-backend`, {
    targetEnv,
    vpc: network.vpc,
})
new FrontendStack(app, `${targetEnv}-${Constant.GENERAL.APP_NAME}-frontend`, {})
