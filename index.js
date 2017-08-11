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

const stat = s => {
  const f = Math.floor(s * 100).toString() + '%'
  return f.length < 3 ? f.padStart(3) : f
}

const padBack = (s, n) => {
  return s.length < n ? s.padEnd(n) : s
}

const search = terms => {
  got(validate`https://api.npms.io/v2/search?q=${terms}`)
    .then(res => {
      const results = JSON.parse(res.body)
      if (results.total === 0) return console.error('No results found!')

      const longestName = longest(results.results.map(n => n.package.name))
      const longestVersion = longest(
        results.results.map(n => n.package.version)
      )

      const choices = results.results.map(n => ({
        name: `${chalk.bold(
          padBack(n.package.name, longestName)
        )} ${chalk.gray.dim(
          padBack(n.package.version, longestVersion)
        )} ${chalk.green.dim(stat(n.score.detail.quality))} ${chalk.yellow.dim(
          stat(n.score.detail.popularity)
        )} ${chalk.blue.dim(stat(n.score.detail.maintenance))} ${chalk.bgRed(
          stat(n.score.final)
        )} ${chalk.dim(n.package.description)}`,
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
