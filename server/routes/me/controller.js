const { wallet } = require('../../services')

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

module.exports = { balance, getMe, getWallet, withdraw }
