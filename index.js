const fs = require('fs');
const jsdiff = require('diff');

// Extend the yeoman-assert module
const assert = module.exports = require('yeoman-assert');

/**
 * Assert that a file matches a snapshot file
 * @param {String} filePath - path to a file
 * @param {String} snapshotFilePath - path to a snapshot file
 * @example
 * assert.snapshotContent(
 *    'swagger.yaml',
 *    path.join(__dirname, 'snapshots', 'swagger.yaml')
 * );
 */
assert.snapshotContent = (filePath, snapshotFilePath) => {
  // Ensure generated file exists before proceeding
  assert.file(filePath);
  assert.file(snapshotFilePath);

  // Get content of generated file and snapshot file
  const generatedFile = fs.readFileSync(filePath);
  const snapshotFile = fs.readFileSync(snapshotFilePath);

  // Use diff to check for differences between files
  const diff = jsdiff.diffTrimmedLines(
    generatedFile.toString(),
    snapshotFile.toString()
  );

  // Construct an object that can be used for processing
  const differences = diff
    .reduce((accumulator, currentValue, currentIndex, array) => {
    let line = accumulator.line;

    if (currentValue.added === undefined) {
      accumulator.line += currentValue.count;
    }

    if (currentValue.removed) {
      return Object.assign(accumulator, {
        line,
        error: accumulator.error.concat({
          line,
          expected: currentValue.value,
          actual: array[currentIndex + 1].value,
        }),
      });
    }
    return accumulator;
  }, {
    line: 1,
    error: [],
  });

  // Throw an AssertionError for each different line found
  if (differences.error.length !== 0) {
    const testCase = differences.error.shift();
    assert.fail(
      testCase.actual,
      testCase.expected,
      `Contents of ${filePath}:${testCase.line} does not match snapshot`,
      '!=='
    );
  }
};
