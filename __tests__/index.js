const fs = require('fs');
const path = require('path');
const jsdiff = require('diff');

jest.mock('fs');
jest.mock('path');

const assert = require('../index');

describe('fileContent', () => {
  let diffSpy;
  let assertFailSpy;

  beforeEach(() => {
    assert.file = jest.fn();
    path.join = jest.fn(() => '/snapshots/swagger.yaml');
    fs.readFileSync = jest.fn()
      .mockReturnValueOnce('description: hello')
      .mockReturnValueOnce('description: hello');
    diffSpy = jest.spyOn(jsdiff, 'diffTrimmedLines');
    assertFailSpy = jest.spyOn(assert, 'fail');
  });

  afterEach(() => {
    diffSpy.mockReset();
    diffSpy.mockRestore();
    assertFailSpy.mockReset();
    assertFailSpy.mockRestore();
  });

  it('calls assert.file to check for existence of filePath', () => {
    assert.snapshotContent('public/swagger.yaml', 'swagger.yaml');
    expect(assert.file.mock.calls[0][0]).toEqual('public/swagger.yaml');
  });

  it('calls assert.file to check for existence of snapshotFilePath', () => {
    assert.snapshotContent('public/swagger.yaml', 'swagger.yaml');
    expect(assert.file.mock.calls[1][0]).toEqual('swagger.yaml');
  });

  it('calls fs.readFileSync with filePath', () => {
    assert.snapshotContent('public/swagger.yaml', 'swagger.yaml');
    expect(fs.readFileSync.mock.calls[0][0]).toEqual('public/swagger.yaml');
  });

  it('calls second fs.readFileSync with path to snapshotFilePath', () => {
    assert.snapshotContent('public/swagger.yaml', 'swagger.yaml');
    expect(fs.readFileSync.mock.calls[1][0]).toEqual('swagger.yaml');
  });

  it('calls jsdiff.diffTrimmedLines with generated file content and snapshot',
    () => {
    assert.snapshotContent('public/swagger.yaml', 'swagger.yaml');
    expect(diffSpy).toHaveBeenCalledTimes(1);
    expect(diffSpy.mock.calls[0][0]).toEqual('description: hello');
    expect(diffSpy.mock.calls[0][1]).toEqual('description: hello');
  });

  it('throws error with `assert.fail` if snapshot does not match', () => {
    fs.readFileSync = jest.fn()
      .mockReturnValueOnce('description: hello')
      .mockReturnValueOnce('description: world');
    expect(() => assert.snapshotContent(
      'public/swagger.yaml',
      'swagger.yaml'
    )).toThrow();
    expect(assertFailSpy).toHaveBeenCalledWith(
      'description: world',
      'description: hello',
      'Contents of public/swagger.yaml:1 does not match snapshot',
      '!=='
    );
    expect(assertFailSpy).toHaveBeenCalledTimes(1);
  });

  it('does not throw error if snapshot matches', () => {
    expect(() => assert.snapshotContent(
      'public/swagger.yaml',
      'swagger.yaml'
    )).not.toThrow();
    expect(assertFailSpy).not.toHaveBeenCalled();
  });
});
