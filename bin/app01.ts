#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { App01Stack } from '../lib/app01-stack';

const app = new cdk.App();
new App01Stack(app, 'App01Stack', {
    env: {
        region: 'us-east-1',
        account: '239329209683'
    }
});
