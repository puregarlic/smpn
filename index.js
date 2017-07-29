#!/usr/bin/env node

const got = require('got')
const open = require('open')
const chalk = require('chalk')
const program = require('commander')
const inquirer = require('inquirer')
const pkg = require('./package.json')

program
  .version(pkg.version)
  .usage('[options] <search terms>')
  .parse(process.argv)

const validate = (strings, terms) => {
  if (!terms[0]) {
    console.error('You need to pass search terms!')
    process.exit()
  }
  return strings[0] + (typeof terms == 'array' ? terms.join('+') : terms)
}

const longest = a => {
  let c = 0,
    d = 0,
    l = 0,
    i = a.length
  if (i)
    while (i--) {
      d = a[i].length
      if (d > c) {
        l = i
        c = d
      }
    }
  return a[l].length
}

const search = terms => {
  got(validate`https://api.npms.io/v2/search?q=${terms}`)
    .then(res => {
      const results = JSON.parse(res.body)
      if (results.total === 0) return console.error('No results found!')

      const longestString = longest(results.results.map(n => n.package.name))

      const choices = results.results.map(n => ({
        name: `${chalk.bold(
          n.package.name.length < longestString
            ? n.package.name.padEnd(longestString) +
              chalk.gray.dim('(' + n.package.version + ')')
            : n.package.name + chalk.gray.dim('(' + n.package.version + ')')
        )} ${chalk.green.dim(
          Math.floor(n.score.detail.quality * 100) + '%'
        )} ${chalk.yellow.dim(
          Math.floor(n.score.detail.popularity * 100) + '%'
        )} ${chalk.blue.dim(
          Math.floor(n.score.detail.maintenance * 100) + '%'
        )} ${chalk.bgRed(Math.floor(n.score.final * 100) + '%')} ${chalk.dim(
          n.package.description
        )}`,
        value: {
          url: n.package.links.npm
        }
      }))

      inquirer
        .prompt({
          type: 'list',
          name: 'lib',
          message: `Here is what we found:
${chalk.green.dim('<Quality>')} ${chalk.yellow.dim(
            '<Popularity>'
          )} ${chalk.blue.dim('<Maintenance>')} ${chalk.bgRed('<Overall>')}`,
          choices: [ ...choices, new inquirer.Separator() ]
        })
        .then(answer => {
          open(answer.lib.url)
        })
    })
    .catch(e => console.log(e))
}

search(program.args)
