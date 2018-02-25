'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      name: 'projectName',
      message: 'Name for the project',
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {
        projectName: this.props.projectName,
      },
    );
  }

  install() {
    this.installDependencies({
      bower: false,
      npm: true,
    });
  }
}
