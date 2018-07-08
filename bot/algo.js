const {
  createOrder,
  PAIR_ASK,
  PAIR_BID,
  TRADE_TICKERS,
} = require('./trade')

class AlgoTrade {
  constructor(fees) {
    this.fees = fees
  }

  fillOrders({ ticker, price, total }) {
    if (!TRADE_TICKERS.includes(ticker.toUpperCase()))
      throw new Error(`FillOrdersError: Wrong ticker: ${ticker}`)

    const price_num = parseFloat(price)
    if ( isNaN(price_num) || price_num === 0 )
      throw new Error(`FillOrdersError: Bad price: ${price}`)

    // console.log('price', price_num)

    const total_amount = parseFloat(total)
    if ( isNaN(total_amount) || total_amount === 0 )
      throw new Error(`FillOrdersError: Bad total amount: ${total}`)

    const amount = total_amount / 20

    // console.log('amount', amount)

    // price is 0.1 BTC per ETH = BTC/ETH
    // baseFees is BTC, mainFees is ETH
    // so fees in BTC are
    const mainFees = 23 * 1e-8
    const baseFees = 15 * 1e-8
    const fees = mainFees * price + baseFees
    // and price changed accordingly
    // TOTAL AMOUNT IN BASE +- FEES / AMOUNT IN MAIN
    const bid_price = ( price * amount - fees ) / amount
    const ask_price = ( price * amount + fees ) / amount

    // BID = BUY ETH below given price
    // ASK = SELL ETH above given price
    // TODO fees
    const orders = [
      ...Array(10).fill(null).map( (e, index) =>
          createOrder(ticker, PAIR_BID, bid_price * (100 - index) / 100, amount)),
      ...Array(10).fill(null).map( (e, index) =>
          createOrder(ticker, PAIR_ASK, ask_price * (100 + index) / 100, amount)),
    ]

    return orders
  }
}

module.exports = AlgoTrade
