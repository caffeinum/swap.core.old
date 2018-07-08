#!/usr/bin/env node

console.clear()
const readline = require('./helpers/readline')
const { HELP, FULL_HELP } = require('./helpers/help')

const bot = require('./bot')

const totals_info = (json) => {
  if (Array.isArray(json))  return `Total: ${json.length}`
  else if (json)            return `Keys: ${Object.keys(json)}`
  else                      return ``
}

const printPromise = (promise) => {
  if (!promise || !promise.then) return promise

  return promise
    .then(json => {
      console.log('Response:')
      console.dir(json)
      console.log(totals_info(json))

      return json
    })
    .catch(({ name, message, ...etc }) => console.error({ name, message }))
}

const selectMethod = (input) => {
  const tokens = input.split(' ').filter(e => !!e)
  const [action, ...payload] = tokens

  if (payload == 'help') {
    return () => console.log(printHelp(action))
  } else if ( payload.length ) {
    const vars = decodeMethod(action, payload)

    return () => bot.callMethod(action, vars)
  } else {
    switch (action) {
      case 'clear':   return () => console.clear()
      case 'me':      return () => bot.getMe()
      case 'balance': return () => bot.runMethod('me/balance')
      case 'o':       return () => bot.getOrders()
      case 'orders':  return () => bot.getOrders()
      case 'help':    return () => console.log(HELP)
      case 'spec':    return () => console.log(FULL_HELP)

      default:        return () => bot.runMethod(input)
    }
  }
}

const runInput = async (input) => {
  try {
    const method = selectMethod(input)

    const reply = method()

    await printPromise(reply)

  } catch (err) {
    console.error( err )
  }

  cycle()
}

const cycle = async (input) => {
  if (input) {
    await runInput(input)
  } else {
    const command = await readline()
    await runInput(command)
  }
}

cycle('me')
