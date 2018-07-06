const methods = [
  {
    name: 'create',
    tokens: ['buy', 'sell', 'buyAmount', 'sellAmount']
  },
  {
    name: 'request',
    tokens: ['id']
  },
  {
    name: 'accept',
    tokens: ['id']
  },
  {
    name: 'swap',
    tokens: ['id']
  }
]

const decodeMethod = (action, payload) => {
  const method = methods.filter( m => m.name == action )[0]

  if (!method) throw new Error(`No method: ${action}`)

  if ( payload.length != method.tokens.length )
    throw new Error(`Wrong length: ${payload}, ${method.tokens}`)

  return method.tokens.reduce((acc, token, index) => {
    acc[token] = payload[index]
    return acc
  }, {})
}

const printHelp = (action) => {
  const method = methods.filter( m => m.name == action )[0]

  if (!method)
    return `no method: ${action}`
  else
    return method.tokens
}

module.exports = {
  methods,
  decodeMethod,
  printHelp,
}
