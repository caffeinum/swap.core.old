const request = require('request-promise-native')
const asciichart = require ('asciichart')

const AlgoTrade = require('./algo')
const { convertOrder, TRADE_TICKERS } = require('./trade')

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
    this.algo = new AlgoTrade()
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
      case 'create':    return this.createOrder(payload)
      case 'request':   return this.requestOrder(payload)
      case 'accept':    return this.acceptOrder(payload)
      case 'swap':      return this.startSwap(payload)
      case 'fill':      return this.fillOrders(payload)
      case 'plotbook':  return this.plotOrderBook(payload)
      default:        return Promise.resolve('no method')
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

  fillOrders(payload) {
    const orders = this.algo.fillOrders(payload)

    const deletion = this.runMethod(`orders/all/delete`)
    const saving = orders.map(data => this.postMethod('orders', data))

    return Promise.all([deletion, ...saving])
  }

  async getBAList(payload) {
    const { ticker: raw_ticker } = payload

    const ticker = raw_ticker.toUpperCase()

    if ( !TRADE_TICKERS.includes(ticker) )
      throw new Error(`PlotOrdersError: No ticker: ${ticker}`)

    const orders = await this.getOrders()

    const filtered = orders
      .map( o => convertOrder(o) )
      .filter( o => o.ticker == ticker)

    const sorted = filtered
      .sort( (o1, o2) => o1.price - o2.price )

    return sorted
  }

  async plotOrderBook(payload) {
    const sorted = await this.getBAList(payload)

    const lowest_price = sorted.slice(0,1).pop().price * 0.9
    const highest_price = sorted.slice(-1).pop().price * 1.1

    const breakPrice = (price) =>
      Math.floor(79 * (price - lowest_price) / (highest_price - lowest_price))

    const series = sorted
      .reduce( (acc, elem) => {
        const index = breakPrice(elem.price)
        acc[ index ] += elem.amount
        return acc
      }, Array(80).fill(0))

    return asciichart.plot(series, { height: 30 })
  }

}

module.exports = new TradeBot()
