import ethereum from './ethereum'
import bitcoin from './bitcoin'

import { EthSwap, BtcSwap } from '../swap/swaps'
import { BTC2ETH } from '../swap/flows'

class SwapWallet {

  constructor () {
    this.ethereum = ethereum
    this.bitcoin = bitcoin

    this.accounts = {}
  }

  init() {
    const ethPrivateKey = localStorage.getItem('ethPrivateKey')
    const btcPrivateKey = localStorage.getItem('btcPrivateKey')

    const eth = ethereum.login(ethPrivateKey)
    const btc = bitcoin.login(btcPrivateKey)

    this.accounts = { eth, btc }

    localStorage.setItem('ethPrivateKey', eth.privateKey)
    localStorage.setItem('btcPrivateKey', btc.getPrivateKey())

    const localClear = localStorage.clear.bind(localStorage)

    global.clear = localStorage.clear = () => {
      localClear()
      localStorage.setItem('ethPrivateKey', eth.privateKey)
      localStorage.setItem('btcPrivateKey', btc.getPrivateKey())
    }

  }

  getFlowConfig(flow) {
    // if (flow != BTC2ETH) return {}

    const ethSwap = new EthSwap({
      gasLimit: 3e6,
    })

    const btcSwap = new BtcSwap({
      account: this.accounts.btc,
      fetchUnspents: (scriptAddress) => this.bitcoin.fetchUnspents(scriptAddress),
      broadcastTx: (txRaw) => this.bitcoin.broadcastTx(txRaw),
    })

    const fetchBalance = () => this.bitcoin.fetchBalance(this.accounts.btc.getAddress())

    return {
      ethSwap,
      btcSwap,
      fetchBalance,
    }
  }

}

export default new SwapWallet()

export { ethereum, bitcoin }
