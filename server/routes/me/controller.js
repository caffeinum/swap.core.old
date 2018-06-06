const { sendStatus, swapToString, orderView } = require('../../services/helpers')
const { app, wallet } = require('../../services/swapApp')

let orders

const status = (req, res) => {
  sendStatus(req, res)(_order)
}

const getMe = async (req, res) => {
  res.json({
    wallet: wallet.view(),
    balance: await wallet.getBalance()
  })
}

const getWallet = (req, res) => {
  res.json(wallet.view())
}

const balance = async (req, res) => {
  let balances = await wallet.getBalance()

  res.json({ balances })
}

const withdraw = async (req, res) => {
  let from = req.params.from
  let to = req.query.to
  let value = req.query.value

  if (!from in ['btc', 'eth']) return res.status(403).json({ error: 'no such currency'})

  console.log('from', from)
  console.log('to', to)
  console.log('value', value)

  try {
    await wallet.withdraw(from, to, value)
    res.json({ to, value })
  } catch (err) {
    res.status(500).json({ error: err, description: err.description })
    throw err
  }
}

const listMyOrders = (req, res) => {
  orders = app.getMyOrders().filter( order => !!order )
  orders = orders.map(orderView)

  res.json(orders)
}

module.exports = { balance, status, getMe, getWallet, withdraw, listMyOrders }
