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

const listMyOrders = (req, res) => {
  orders = app.getMyOrders().filter( order => !!order )
  orders = orders.map(orderView)

  res.json(orders)
}

module.exports = { balance, status, getMe, getWallet, listMyOrders }
