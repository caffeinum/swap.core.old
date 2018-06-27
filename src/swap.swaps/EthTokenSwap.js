import SwapApp, { SwapInterface } from 'swap.app'


class EthTokenSwap extends SwapInterface {

  /**
   *
   * @param {object}    options
   * @param {string}    options.address
   * @param {array}     options.abi
   * @param {string}    options.tokenAddress
   * @param {array}     options.tokenAbi
   * @param {number}    options.gasLimit
   * @param {function}  options.fetchBalance
   */
  constructor(options) {
    super()

    if (typeof options.address !== 'string') {
      throw new Error('EthTokenSwap: "address" required')
    }
    if (!Array.isArray(options.abi)) {
      throw new Error('EthTokenSwap: "abi" required')
    }
    if (typeof options.tokenAddress !== 'string') {
      throw new Error('EthTokenSwap: "tokenAddress" required')
    }
    if (!Array.isArray(options.tokenAbi)) {
      throw new Error('EthTokenSwap: "tokenAbi" required')
    }

    this._swapName      = 'ethTokenSwap'

    this.address        = options.address
    this.abi            = options.abi
    this.tokenAddress   = options.tokenAddress
    this.tokenAbi       = options.tokenAbi

    this.gasLimit       = options.gasLimit || 3e6
    this.fetchBalance   = options.fetchBalance
  }

  _initSwap() {
    this.contract       = new SwapApp.env.web3.eth.Contract(this.abi, this.address)
    this.ERC20          = new SwapApp.env.web3.eth.Contract(this.tokenAbi, this.tokenAddress)
  }

  /**
   *
   * @param {object} data
   * @param {string} data.participantAddress
   * @param {function} handleTransactionHash
   */
  sign(data, handleTransactionHash) {
    const { participantAddress } = data

    return new Promise(async (resolve, reject) => {
      const params = {
        from: SwapApp.services.auth.accounts.eth.address,
        gas: this.gasLimit,
      }

      try {
        const result = await this.contract.methods.sign(participantAddress).send(params)
          .on('transactionHash', (hash) => {
            if (typeof handleTransactionHash === 'function') {
              handleTransactionHash(hash)
            }
          })
          .on('error', (err) => {
            reject(err)
          })

        resolve(result)
      }
      catch (err) {
        reject(err)
      }
    })
  }

  /**
   *
   * @param {object} data
   * @param {BigNumber} data.amount
   * @param {function} handleTransactionHash
   * @returns {Promise}
   */
  approve(data, handleTransactionHash) {
    const { amount } = data

    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.ERC20.methods.approve(this.address, amount.toNumber()).send({
          from: SwapApp.services.auth.accounts.eth.address,
          gas: this.gasLimit,
        })
          .on('transactionHash', (hash) => {
            if (typeof handleTransactionHash === 'function') {
              handleTransactionHash(hash)
            }
          })
          .on('error', err => {
            reject(err)
          })

        resolve(result)
      }
      catch (err) {
        reject(err)
      }
    })
  }

  /**
   *
   * @param {object} data
   * @param {string} data.owner
   * @param {string} data.spender
   * @returns {Promise}
   */
  checkAllowance(data) {
    const { owner, spender } = data

    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.ERC20.methods.allowance(owner, spender).call({
          from: SwapApp.services.auth.accounts.eth.address,
        })

        resolve(result)
      }
      catch (err) {
        reject(err)
      }
    })
  }

  /**
   *
   * @param {object} data
   * @param {string} data.secretHash
   * @param {string} data.participantAddress
   * @param {BigNumber} data.amount
   * @param {function} handleTransactionHash
   */
  create(data, handleTransactionHash) {
    const { secretHash, participantAddress, amount } = data

    return new Promise(async (resolve, reject) => {
      const hash    = `0x${secretHash.replace(/^0x/, '')}`
      const values  = [ hash, participantAddress, amount.toNumber(), this.tokenAddress ]
      const params  = { from: SwapApp.services.auth.accounts.eth.address, gas: this.gasLimit }

      try {
        const result = await this.contract.methods.createSwap(...values).send(params)
          .on('transactionHash', (hash) => {
            if (typeof handleTransactionHash === 'function') {
              handleTransactionHash(hash)
            }
          })
          .on('error', (err) => {
            reject(err)
          })

        resolve(result)
      }
      catch (err) {
        reject(err)
      }
    })
  }

  getBalance({ ownerAddress }) {
    return new Promise(async (resolve, reject) => {
      let balance

      try {
        balance = await this.contract.methods.getBalance(ownerAddress).call({
          from: SwapApp.services.auth.accounts.eth.address,
        })
      }
      catch (err) {
        reject(err)
      }

      resolve(balance)
    })
  }

  /**
   *
   * @param {object} data
   * @param {string} data.ownerAddress
   * @param {BigNumber} data.expectedValue
   * @returns {Promise.<string>}
   */
  async checkBalance(data) {
    const { ownerAddress, expectedValue } = data
    const balance = await this.getBalance({ ownerAddress })

    if (expectedValue.isGreaterThan(balance)) {
      return `Expected value: ${expectedValue.toNumber()}, got: ${balance}`
    }
  }

  /**
   *
   * @param {object} data
   * @param {string} data.secret
   * @param {string} data.ownerAddress
   * @param {function} handleTransactionHash
   */
  withdraw(data, handleTransactionHash) {
    const { ownerAddress, secret } = data

    return new Promise(async (resolve, reject) => {
      const _secret = `0x${secret.replace(/^0x/, '')}`

      const params = {
        from: SwapApp.services.auth.accounts.eth.address,
        gas: this.gasLimit,
      }

      try {
        const result = await this.contract.methods.withdraw(_secret, ownerAddress).send(params)
          .on('transactionHash', (hash) => {
            if (typeof handleTransactionHash === 'function') {
              handleTransactionHash(hash)
            }
          })
          .on('error', (err) => {
            reject(err)
          })

        resolve(result)
      }
      catch (err) {
        reject(err)
      }
    })
  }

  /**
   *
   * @param {object} data
   * @param {string} data.participantAddress
   * @param {function} handleTransactionHash
   * @returns {Promise}
   */
  refund(data, handleTransactionHash) {
    const { participantAddress } = data

    return new Promise(async (resolve, reject) => {
      const params = {
        from: SwapApp.services.auth.accounts.eth.address,
        gas: this.gasLimit,
      }

      const receipt = await this.contract.methods.refund(participantAddress).send(params)
        .on('transactionHash', (hash) => {
          if (typeof handleTransactionHash === 'function') {
            handleTransactionHash(hash)
          }
        })
        .on('error', (err) => {
          reject(err)
        })

      resolve(receipt)
    })
  }

  /**
   *
   * @param {object} data
   * @param {string} data.participantAddress
   * @returns {Promise}
   */
  getSecret(data) {
    const { participantAddress } = data

    return new Promise(async (resolve, reject) => {
      try {
        const secret = await this.contract.methods.getSecret(participantAddress).call({
          from: SwapApp.services.auth.accounts.eth.address,
        })

        const secretValue = secret && !/^0x0+/.test(secret) ? secret : null

        resolve(secretValue)
      }
      catch (err) {
        reject(err)
      }
    })
  }

  /**
   *
   * @param {object} data
   * @param {string} data.participantAddress
   * @param handleTransactionHash
   * @returns {Promise}
   */
  close(data, handleTransactionHash) {
    const { participantAddress } = data

    return new Promise(async (resolve, reject) => {
      const params = {
        from: SwapApp.services.auth.accounts.eth.address,
        gas: this.gasLimit,
      }

      try {
        const result = await this.contract.methods.close(participantAddress).send(params)
          .on('transactionHash', (hash) => {
            if (typeof handleTransactionHash === 'function') {
              handleTransactionHash(hash)
            }
          })
          .on('error', (err) => {
            reject(err)
          })

        resolve(result)
      }
      catch (err) {
        reject(err)
      }
    })
  }
}


export default EthTokenSwap
