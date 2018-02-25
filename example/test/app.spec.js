const assert = require('@j154004/yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

describe('app', () => {
  before((done) => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        projectName: 'Hello world'
      })
      .on('end', done);
  });

  it('the generator can be required without throwing', () => {
    require('../generators/app');
  });

  it('populates README file', () => {
    assert.snapshotContent(
      'README.md',
      path.join(__dirname, 'snapshots', 'README.md')
    );
  })
});
