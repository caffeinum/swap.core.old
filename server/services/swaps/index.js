const { EthSwap, EthTokenSwap, BtcSwap } = require('swap.swaps')

const {
  eth_swap_abi,

  token_swap_abi,
  token_contract_abi,
} = require('../abi')

const { bitcoin, ethereum } = require('../instances')

module.exports = [
  new EthSwap({
    address: '0xdbC2395f753968a93465487022B0e5D8730633Ec',
    abi: eth_swap_abi,
    fetchBalance: (address) => ethereum.fetchBalance(address),
  }),
  new EthTokenSwap({
    address: '0xBA5c6DC3CAcdE8EA754e47c817846f771944518F',
    name: 'NOXON',
    abi: token_swap_abi,
    tokenAddress: '0x60c205722c6c797c725a996cf9cca11291f90749',
    tokenAbi: token_contract_abi,
    fetchBalance: (address) => ethereum.fetchTokenBalance(address),
  }),
  new BtcSwap({
    fetchBalance: (address) => bitcoin.fetchBalance(address),
    fetchUnspents: (scriptAddress) => bitcoin.fetchUnspents(scriptAddress),
    broadcastTx: (txRaw) => bitcoin.broadcastTx(txRaw),
  }),
]
