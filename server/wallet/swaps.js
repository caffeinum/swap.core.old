const { EthSwap, EthTokenSwap, BtcSwap } = require('../../lib/swap.swaps')

const {
  eth_swap_abi,

  token_swap_abi,
  token_contract_abi,
} = require('./abi')

const bitcoin = require('./bitcoin')
const ethereum = require('./ethereum')

module.exports = [
  new EthSwap({
      address: '0xe08907e0e010a339646de2cc56926994f58c4db2',
      abi: eth_swap_abi,
      fetchBalance: (address) => ethereum.fetchBalance(address),
    }),
  new EthTokenSwap({
    address: '0x527458d3d3a3af763dbe2ccc5688d64161e81d97',
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
