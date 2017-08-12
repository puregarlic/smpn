#!/usr/bin/env node

const got = require('got')
const open = require('open')
const chalk = require('chalk')
const program = require('commander')
const inquirer = require('inquirer')
const pkg = require('./package.json')

program
  .version(pkg.version)
  .usage('[options] [search terms]')
  .option('-a --author [name]', 'Search for a specific author')
  .option('-s --scope [scope]', 'Restrict search to a specific scope')
  .option('-k --keywords [keywords]', 'Filter results to packages with the specific keywords. Comma seperated, no spaces in between!')
  .option('-d --not-deprecated', 'Restrict to non-deprecated results')
  .option('-D --deprecated', 'Restrict to deprecated results')
  .option('-u --not-unstable', 'Restrict to results above v1.0.0')
  .option('-U --unstable', 'Restrict to results beneath v1.0.0')
  .option('-i --not-insecure', 'Restrict to secure results')
  .option('-I --insecure', 'Restrict to insecure/vulnerable results')
  .option('-b --no-boost-exact', 'Do not boost exact search matches')
  .option('-e --score-effect [number]', 'Set the score effect value. Default: 15.3')
  .option('-q --quality-weight [number]', 'Specify a quality weight. Default: 1.95')
  .option('-p --popularity-weight [number]', 'Specify a popularity weight. Default: 3.3')
  .option('-m --maintenance-weight [number]', 'Specify a maintenance weight. Default: 2.05')
  .parse(process.argv)

const plusify = (terms) => {
  let result
  if (!terms[0]) {
    console.error('You need to pass search terms!')
    process.exit()
  }
  if (typeof terms == 'array' ? result = terms : result = [terms.join('+')])
  if (program.author) result.push(`author:${program.author}`)
  if (program.scope) result.push(`scope:${program.scope}`)
  if (program.keywords) result.push(`keywords:${program.keywords}`)
  if (program.notDeprecated || program.notUnstable || program.notInsecure) {
    let not = []
    if (program.notDeprecated) not.push('deprecated')
    if (program.notUnstable) not.push('unstable')
    if (program.notInsecure) not.push('insecure')
    result.push(`not:${not.join(',')}`)
  }
  if (program.deprecated || program.unstable || program.insecure) {
    let is = []
    if (program.deprecated) is.push('deprecated')
    if (program.unstable) is.push('unstable')
    if (program.insecure) is.push('insecure')
    result.push(`is:${is.join(',')}`)
  }
  if (program.noBoostExact) result.push('boost-exact:false')
  if (program.scoreEffect) result.push(`score-effect:${program.scoreEffect}`)
  if (program.qualityWeight) result.push(`quality-weight:${program.qualityWeight}`)
  if (program.popularityWeight) result.push(`popularity-weight:${program.popularityWeight}`)
  if (program.maintenanceWeight) result.push(`maintenance-weight:${program.maintenanceWeight}`)
  return result.join('+')
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

const padFront = (s, n) => {
  return s.length < n ? s.padStart(n) : s
}

const padBack = (s, n) => {
  return s.length < n ? s.padEnd(n) : s
}

const search = terms => {
  got(`https://api.npms.io/v2/search?q=` + plusify(terms))
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
