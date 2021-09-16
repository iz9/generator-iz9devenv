class GitGenerator extends require('yeoman-generator') {
  writing() {
    this.fs.copyTpl(
      this.templatePath('gitignore.ejs'),
      this.destinationPath('.gitignore'),
    )
    this.fs.copyTpl(
      this.templatePath('gitattributes.ejs'),
      this.destinationPath('.gitattributes'),
    )
  }

  async end() {
    await this.spawnCommand('git', ['init'])
  }
}

module.exports = GitGenerator
