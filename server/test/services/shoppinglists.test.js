const assert = require('assert');
const app = require('../../src/app');

describe('\'shoppinglists\' service', () => {
  it('registered the service', () => {
    const service = app.service('shoppinglists');

    assert.ok(service, 'Registered the service');
  });
});
