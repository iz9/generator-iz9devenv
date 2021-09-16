class CommitlintGenerator extends require('yeoman-generator') {
  async configuring() {
    const deps = [
      '@commitlint/cli',
      '@commitlint/config-conventional',
      'standard-version',
      'commitizen',
    ]
    await this.addDevDependencies(deps)
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('commitlint.config.js.ejs'),
      this.destinationPath('commitlint.config.js'),
    )
    this.fs.copyTpl(
      this.templatePath('versionrc.js.ejs'),
      this.destinationPath('.versionrc.js'),
    )
  }

  async end() {
    await this.spawnCommand('npm', [
      'set-script',
      'release',
      'standard-version',
    ])
    await this.spawnCommand('npx', [
      'commitizen',
      'init',
      'cz-conventional-changelog',
      '--save-dev',
      '--save-exact',
    ])
    await this.spawnCommand('npx', [
      'husky',
      'add',
      '.husky/prepare-commit-msg',
      'exec < /dev/tty && node_modules/.bin/cz --hook || true',
    ])
    await this.spawnCommand('npx', [
      'husky',
      'add',
      '.husky/commit-msg',
      'npx --no-install commitlint --edit',
    ])
    await this.spawnCommand('sed', [
      '-i',
      's/^npx.*/& $1/',
      '.husky/commit-msg',
    ]) // because previous hook eats $1 substring. Issue: https://github.com/typicode/husky/issues/924
  }
}

module.exports = CommitlintGenerator
