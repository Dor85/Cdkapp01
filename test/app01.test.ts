import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import App01 = require('../lib/app01-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new App01.App01Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});