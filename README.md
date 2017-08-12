# smpn

> Go make smpn great

I love searching for modules, but there's no great way to search for them from
the CLI. The current search mechanism using `npm` is, quite honestly, pretty
terrible. Although `npms` [has a cli](https://www.npmjs.com/package/npms-cli), I
wanted something a bit more compact, but with the same insights and information.
I decided to use their API, so I'm sure you can figure out where the name came
from.

## Features

+ Search using [`npms`](https://npms.io)
  + See all of the same repo ratings
  + Use the same filters you probably don't know
+ Open NPM package entries in your browser

## Install

Super simple stuff. Take your pick:

Standard global install:
```shell
# Install globally, the boring way
npm i -g smpn
# or if you're a cool kitten
yarn add global smpn

# Take a peek at the help docs
smpn --help
```

Or maybe you're hip and you don't install things anymore;
```shell
# Install temporarily and check out the help docs
npx smpn --help
```
