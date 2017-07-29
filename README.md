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
  + See most of the same stats
+ Open NPM package entries in your browser

## Install

Super simple stuff. Take your pick:

Standard global install:
```shell
# Install globally,
npm i -g smpn
# or
yarn add global smpn

# Then use as you do
smpn <search>
```

Or if you don't quite want to install it,
```shell
# Install temporarily and run
npx smpn <search>
```
