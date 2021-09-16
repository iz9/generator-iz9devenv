class LintStagedGenerator extends require('yeoman-generator') {
  async end() {
    await this.spawnCommand('npx', ['mrm@2', 'lint-staged'])
  }
}

module.exports = LintStagedGenerator
