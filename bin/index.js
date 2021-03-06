#!/usr/bin/env node

const { spawn } = require('child_process')

const [,, ...args] = process.argv

if (args.length === 0) process.exit()

const commands = args.join(' ').split(/\s?(?<!\\)\+\s?/).filter(Boolean)

process.stdin.resume()

let started = 0

for ( rawCommand of commands) {
  started++

  const [command, ...args] = rawCommand.replace(/\\\+/g, '+').split(' ')

  const child = spawn(command, [...args], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
    shell: true,
  })

  child.on('exit', code => {
    if (!--started) process.exit(code)
  })
}