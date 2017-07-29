#!/usr/bin/env node

const got = require('got')
const open = require('open')
const program = require('commander')
const inquirer = require('inquirer')

program.version('1.0.0').usage('[options] <search terms>').parse(process.argv)

const validate = (strings, terms) => {
  if (!terms[0]) {
    console.error('You need to pass search terms!')
    process.exit()
  }
  return strings[0] + (typeof terms == 'array' ? terms.join('+') : terms)
}

const search = terms => {
  got(validate`https://api.npms.io/v2/search?q=${terms}`)
    .then(res => {
      const results = JSON.parse(res.body)
      const choices = results.results.map(n => ({
        name: n.package.name,
        value: {
          url: n.package.links.npm
        }
      }))

      inquirer
        .prompt({
          type: 'list',
          name: 'lib',
          message: 'Here is what we found:',
          choices: [ new inquirer.Separator(), ...choices ]
        })
        .then(answer => {
          open(answer.lib.url)
        })
    })
    .catch(e => console.log(e))
}

search(program.args)
