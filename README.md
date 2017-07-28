# smpn

> Go make smpn great

I love searching for modules, but there's no great way to search for them from
the CLI. The current search mechanism using `npm` is, quite honestly, pretty
terrible. And, over on the web side of things, we have the fantastic `npms`. So,
I wanted to build `smpn` as a CLI interface for `npms`. I'm sure you can see the
namesake.

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
