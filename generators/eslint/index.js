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
    this.spawnCommandSync('npx', ['eslint', '--init'])
    console.log('command')
    const configPath = path.resolve(this.destinationPath(), '.eslintrc.js')
    let config = new EslintConfig()
    config
      .readFromFile(configPath)
      .setIndent(2)
      .setOverridesForConfigFiles()
      .addPrettier()
      .addPrettierOptions()
      .make()
    console.log('config made', config.value)

    // hack because yoman's this.fs runs any changes in the virtual fs and then only applies it
    // fs.unlinkSync(configPath
    console.log('config.toString()', config.toString())
    fs.writeFileSync(configPath, config.toString())

    this.spawnCommandSync('npm', ['set-script', 'prettify', 'prettier --write'])
    this.spawnCommandSync('npm', ['run', 'prettify', './.eslintrc.js'])
    this.spawnCommandSync('npm', ['run', 'prettify', './.prettierrc'])
    this.spawnCommandSync('npm', ['run', 'prettify', 'src'])
  }
}

class EslintConfig {
  constructor() {
    this._CONFIG_PLACEHOLDER_ = '__SET_PREVIOUS_CONFIGS_CONTENT_HERE__'
    this.prevConfig = null
    this.value = []
    this.value.push(
      'const fs = require("fs");',
      'const path = require("path");',
      this._CONFIG_PLACEHOLDER_,
    )
  }

  readFromFile(pathToConfig) {
    const prevConfig = require(pathToConfig)
    if (prevConfig) {
      // todo: clone prev conf
      this.prevConfig = prevConfig
    }
    return this
  }

  setIndent(indent = 2) {
    this.prevConfig.rules.indent = ['error', indent]
    return this
  }

  addPrettier() {
    if (!this.prevConfig.plugins) {
      this.prevConfig.plugins = []
    }
    this.prevConfig.plugins.push('prettier')
    this.prevConfig.extends.push('prettier')

    return this
  }

  addPrettierOptions() {
    this.value.push(
      '/* ***** Add prettier options **** */;',
      'const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, ".prettierrc"), "utf8"));',
      'config.rules["prettier/prettier"] = ["error", prettierOptions];',
    )
    return this
  }

  setOverridesForConfigFiles() {
    if (!this.prevConfig.overrides) {
      this.prevConfig.overrides = []
    }
    this.prevConfig.overrides.push({
      files: ['./.*.js', './*.config.js'],
      parser: 'esprima',
      extends: ['eslint:recommended'],
      env: { commonjs: true, es2021: true, node: true },
      parserOptions: { ecmaVersion: 12, sourceType: 'script' },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    })
    return this
  }

  make() {
    this.value[
      this.value.indexOf(this._CONFIG_PLACEHOLDER_)
    ] = `const config = ${JSON.stringify(this.prevConfig)};`
    this.value.push('module.exports=config;')
    return this
  }

  toString() {
    return this.value.join('\n')
  }
}

// function buildNextEslintConfigToString(config){
//   if (!config.plugins) {
//     config.plugins = []
//   }
//   config.plugins.push('prettier')
//   config.rules.indent = ['error', 2]
//   config.extends.push('prettier')
//
//   config.
// }
//
//
//
// function mutateEslintConfig(config) {
//
//   return config
// }
//
// function nextConfigContentString(config) {
//   const content = []
//   config = mutateEslintConfig(config)
//   content.push('const fs = require("fs");')
//   content.push('const path = require("path");')
//   content.push(`const prettierOptions = JSON.parse(
//     fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
//   );`)
//   content.push(`const config = ${JSON.stringify(config)};`)
//   content.push(
//     'config.rules["prettier/prettier"] = ["error", prettierOptions];',
//   )
//   content.push('module.exports = config')
//   return content.join('\n')
// }

module.exports = EslintGenerator
