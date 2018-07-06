const request = require('request-promise-native')

const BASE_URL = 'http://localhost:1337'

const parse = (str) => {
  try {
    return JSON.parse(str)
  } catch (err) {
    return str
  }
}

class TradeBot {
  constructor() {
    this.orders = []
  }

  getOrderId(id) {
    if ( !isNaN(parseInt(id)) ) {
      const index = parseInt(id)

      if (index <= 0)
        throw new Error(`Only positive indices allowed: ${index}`)

      const order = this.orders[index - 1]

      if (!order)
        throw new Error(`No such order: ${index}`)

      id = order.id
      console.log('found order', order)

      if ( !id || id[0] != 'Q' )
        throw new Error(`Wrong ID format: ${id}`)
    }

    return id
  }

  async runMethod(str) {
    if (!str) str = 'me'

    return request(`${BASE_URL}/${str}`)
      .then(json => parse(json))
  }

  async postMethod(str, data) {
    if (!str) str = 'orders'

    const options = {
      method: 'POST',
      url: `${BASE_URL}/${str}`,
      body: data,
      json: true
    }

    return request(options)
      .then(json => parse(json))
  }

  async getOrders() {
    return this.runMethod('orders')
      .then(orders => this.orders = orders)
      // .then(orders => orders.reduce(
      //   (acc, order, index) => (acc[index] = order, acc),
      //   {})
      // )
  }

  async getMe() {
    return this.runMethod('me')
  }

  async callMethod(name, payload) {
    console.log('Calling', name, payload)

    switch (name) {
      case 'create':  return this.createOrder(payload)
      case 'request': return this.requestOrder(payload)
      case 'accept':  return this.acceptOrder(payload)
      case 'swap':    return this.startSwap(payload)
      default:        return () => console.log('no method')
    }
  }

  createOrder(payload) {
    const { buy, sell, buyAmount, sellAmount } = payload

    const data = {
      buyCurrency: buy.toUpperCase(),
      sellCurrency: sell.toUpperCase(),
      buyAmount,
      sellAmount
    }

    return this.postMethod('orders', data)
  }

  requestOrder(payload) {
    let { id } = payload

    id = this.getOrderId(id)

    return this.runMethod(`orders/${id}/request`)
  }

  acceptOrder({ id }) {
    id = this.getOrderId(id)

    return this.runMethod(`orders/${id}/accept`)
  }

  startSwap({ id }) {
    id = this.getOrderId(id)

    return this.runMethod(`swaps/${id}/go`)
  }
}

module.exports = new TradeBot()
