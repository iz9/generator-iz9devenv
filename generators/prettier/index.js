class PrettierGenerator extends require('yeoman-generator') {
  async configuring() {
    await this.addDevDependencies('prettier')
  }
  writing() {
    this.fs.copyTpl(
      this.templatePath('prettierrc.ejs'),
      this.destinationPath('.prettierrc'),
    )
    this.fs.copyTpl(
      this.templatePath('prettierignore.ejs'),
      this.destinationPath('.prettierignore'),
    )
    this.fs.copyTpl(
      this.templatePath('editorconfig.ejs'),
      this.destinationPath('.editorconfig'),
    )
  }
  async end() {
    await this.spawnCommand('npm', [
      'set-script',
      'prettify',
      'prettier --write',
    ])
    await this.spawnCommand('npm', [
      'set-script',
      'prettify',
      'prettier --write',
    ])
    // await this.spawnCommand('npm', ['run', 'prettify'])
  }
}

module.exports = PrettierGenerator
