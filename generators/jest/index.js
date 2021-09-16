const hasPackage = require('../../utils/has_package')

class JestGenerator extends require('yeoman-generator') {
  constructor(opts, args) {
    super(opts, args)
    this._state = {
      isTs: false,
    }
  }

  initializing() {
    this._state.isTs = hasPackage.call(this, 'typescript')
  }

  async configuring() {
    const deps = ['jest', '@types/jest']
    if (this._state.isTs) {
      deps.push('ts-jest')
    }
    await this.addDevDependencies(deps)
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('jest.config.js.ejs'),
      this.destinationPath('jest.config.js'),
      { isTs: this._state.isTs },
    )
  }

  async end() {
    await this.spawnCommand('npm', [
      'set-script',
      'jest',
      'jest --coverage=false',
    ])
    await this.spawnCommand('npm', [
      'set-script',
      'jest:coverage',
      'jest --coverage=true',
    ])
    await this.spawnCommand('npm', [
      'set-script',
      'jest:precommit',
      'jest --coverage=false --onlyChanged --passWithNoTests',
    ])
    await this.spawnCommand('npx', [
      'husky',
      'add',
      '.husky/pre-commit',
      'npm run jest:precommit',
    ])
  }
}

module.exports = JestGenerator
