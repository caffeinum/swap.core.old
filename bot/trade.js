const PAIR_BID = true
const PAIR_ASK = false

const TRADE_TICKERS = [
  'ETH-BTC',
  'NOXON-BTC',
  'BTRM-BTC',
  'NOXON-ETH',
]

const parsePair = (str) => {
  if (!str) throw new Error(`Empty string: ${str}`)
  if (typeof str != 'string') throw new Error(`ParseTickerError: Not a string: ${str}`)

  const tokens = str.split('-')
  if (!tokens.length == 2) throw new Error(`ParseTickerError: Wrong tokens: ${str}`)

  if (TRADE_TICKERS.includes(str))
    str = str
  else
    str = tokens.reverse().join('-')

  if (!TRADE_TICKERS.includes(str)) throw new Error(`ParseTickerError: Ticker not found: ${str}`)

  const MAIN = tokens[0].toUpperCase()
  const BASE = tokens[1].toUpperCase()

  return {
    MAIN,
    BASE,
  }
}

/*
* 10 ETH -> 1 BTC
*
* ticker: ETH-BTC
*
* So we are on ETH market, thus:
*   - ASK orders are SELL ETH (for BTC),
*   - BID orders are BUY ETH (for BTC)
*
* This order is SELLING ETH, to it's ASK
* type: BID = true, ASK = false
*
* Price is also calculated in BTC, while amount in ETH
* price: 0.1
* amount: 10
*
*
* So, for type = ASK
*
* buyCurrency: BTC = base
* sellCurrency: ETH = main
* buyAmount: 1 BTC = (0.1 BTC/ETH) * 10 ETH = price * amount
* sellAmount: 10 ETH = 10 ETH = amount
*
*/
const createOrder = (ticker, type, price, amount) => {
  // console.log('create order', ticker, type, price, amount)
  const { MAIN, BASE } = parsePair(ticker)
  if (!MAIN || !BASE) throw new Error(`CreateOrderError: No currency: ${main}-${base}`)

  if (![PAIR_ASK, PAIR_BID].includes(type)) throw new Error(`CreateOrderError: Wrong order type: ${type}`)

  const base = { currency: BASE, amount: price * amount }
  const main = { currency: MAIN, amount: amount }

  const buy   = (type == PAIR_ASK) ? base : main
  const sell  = (type == PAIR_ASK) ? main : base

  return {
    buyCurrency:  buy.currency.toLowerCase(),
    sellCurrency: sell.currency.toLowerCase(),
    buyAmount:    buy.amount,
    sellAmount:   sell.amount,
  }
}

module.exports = {
  createOrder,
  PAIR_ASK,
  PAIR_BID,
  TRADE_TICKERS,
}
