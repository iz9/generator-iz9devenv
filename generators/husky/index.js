class HuskyGenerator extends require('yeoman-generator') {
  async configuring() {
    await this.addDevDependencies('husky')
  }

  async end() {
    await this.spawnCommand('npm', ['set-script', 'prepare', 'husky install'])
    await this.spawnCommand('npm', ['run', 'prepare'])
  }
}

module.exports = HuskyGenerator
