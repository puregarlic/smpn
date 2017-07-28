#!/usr/local/bin/node

const got = require('got')
const program = require('commander')
const inquirer = require('inquirer')

program.version('1.0.0').usage('[options] <search terms>').parse(process.argv)

const plusify = (strings, args) => {
  return args[0].replace(/ /, '+')
}

const search = terms => {
  got('https://api.npms.io/v2/search?q=' + plusify`${terms}`)
    .then(res => {

      const results = JSON.parse(res.body)
      const choices = results.results.map(n => n.package.name)

      inquirer.prompt({
        type: 'list',
        name: 'Results',
        message: 'Here is what we found:',
        choices
      })
    })
    .catch(e => console.log(e))
}

search(program.args)
