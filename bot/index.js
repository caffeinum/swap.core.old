const readline = require('./readline')
const bot = require('./trade-bot')
const { methods, decodeMethod, printHelp } = require('./methods')

const printPromise = (promise) => {
  if (!promise || !promise.then) return promise

  return promise
    .then(json => {
      console.log('Response:')
      console.dir(json)
      return json
    })
    .catch(({ name, message, ...etc }) => console.error({ name, message }))
}

const selectMethod = (input) => {
  const tokens = input.split(' ')
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
