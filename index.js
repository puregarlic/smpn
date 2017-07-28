#!/usr/local/bin/node

const got = require('got')
const open = require('open')
const program = require('commander')
const inquirer = require('inquirer')

program.version('1.0.0').usage('[options] <search terms>').parse(process.argv)

const plusify = (strings, args) => {
  if (!args[0]) {
    console.error('You need to pass search terms!')
    process.exit()
}
  return args[0].replace(/ /, '+')
}

const search = terms => {
  got('https://api.npms.io/v2/search?q=' + plusify`${terms}`)
    .then(res => {

      const results = JSON.parse(res.body)
      const choices = results.results.map(n => n.package.name)

      inquirer.prompt({
        type: 'list',
        name: 'lib',
        message: 'Here is what we found:',
        choices
      }).then(answer => {
        got('https://api.npms.io/v2/package/' + plusify`${answer.lib}`)
          .then(desc => {
            const results = JSON.parse(desc.body)
            open(results.collected.metadata.links.npm)
          })
      })
    })
    .catch(e => console.log(e))
}

search(program.args)
