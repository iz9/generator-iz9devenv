const path = require('path')
const fs = require('fs')

class EslintGenerator extends require('yeoman-generator') {
  async configuring() {
    let deps = [
      'eslint',
      'prettier',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
    ]
    await this.addDevDependencies(deps)
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('eslintignore.ejs'),
      this.destinationPath('.eslintignore'),
    )
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
    await this.spawnCommand('npx', ['eslint', '--init'])

    const configPath = path.resolve(this.destinationPath(), '.eslintrc.js')
    let config = require(configPath)
    config = nextConfigContentString(config, configPath)

    // hack because yoman's this.fs runs any changes in the virtual fs and then only applies it
    fs.unlinkSync(configPath)
    fs.writeFileSync(configPath, config)

    this.spawnCommandSync('npm', ['set-script', 'prettify', 'prettier --write'])
    this.spawnCommandSync('npm', ['run', 'prettify', './.eslintrc.js'])
    this.spawnCommandSync('npm', ['run', 'prettify', './.prettierrc'])
    this.spawnCommandSync('npm', ['run', 'prettify', 'src'])
  }
}

function mutateEslintConfig(config) {
  if (!config.plugins) {
    config.plugins = []
  }
  config.plugins.push('prettier')
  config.rules.indent = ['error', 2]
  config.extends.push('prettier')
  return config
}

function nextConfigContentString(config) {
  const content = []
  config = mutateEslintConfig(config)
  content.push('const fs = require("fs");')
  content.push('const path = require("path");')
  content.push(`const prettierOptions = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
  );`)
  content.push(`const config = ${JSON.stringify(config)};`)
  content.push(
    'config.rules["prettier/prettier"] = ["error", prettierOptions];',
  )
  content.push('module.exports = config')
  return content.join('\n')
}

module.exports = EslintGenerator
