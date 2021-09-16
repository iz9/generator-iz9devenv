const chalk = require('chalk')
class Help extends require('yeoman-generator') {
  async configuring() {
    const generatorsPath = require('path').resolve(
      this.templatePath(),
      '..',
      '..',
    )
    require('fs')
      .readdirSync(generatorsPath)
      .filter(i => i !== 'help')
      .sort()
      .forEach(logItem, this)
  }
}

function logItem(item, idx) {
  const colors = ['magenta', 'blueBright']
  this.log(chalk[colors[idx % 2]](`*    ${item}`))
}

module.exports = Help
