# REST API interface for swap-core

This is a NodeJS server for using `swap-core` library. It stores your private keys locally and operates them, so you **don't want** to use share the server with somebody else.

To use your own wallet, place `.env` file in the root with your keys:

    .env:

    ETH_KEY=...
    BTC_KEY=...

## Simplest usage

1. Install needed packages


    npm i

2. Run server with


    npm run server

or


    npm run server-dev

3. List available orders


    GET /orders

    ->

    [ ...
    {
        "id": "QmWM4qK2jhQ3cyXpKF7qsKBa2WiVSprqGYhsEX9bxcPdZo-1527476621240",
        "isMy": false,
        "buyAmount": 1,
        "buyCurrency": "ETHTOKEN",
        "sellAmount": 0.001,
        "sellCurrency": "BTC",
        "owner": {
            "peer": "QmWM4qK2jhQ3cyXpKF7qsKBa2WiVSprqGYhsEX9bxcPdZo",
            "reputation": 10
        }
    },
    ... ]

2. Extract an ID, e.g. `"QmWM4qK2jhQ3cyXpKF7qsKBa2WiVSprqGYhsEX9bxcPdZo-1527476621240"`

3. Start Swap:


    GET /orders/:id/start-swap

4. Wait for acceptance from another peer, checking status:


    GET /orders/:id/status

5. Follow steps to finish swap:
  - exchange signatures
  - generate secret
  - instruction
  - is not
  - finished
  - yet
  - etc

## Interface

### Admin

Server wallet information: balance, peer ID, addresses.

    /me

    =>

    {
      "balances": {
        "eth": 97.72631876,
        "btc": 1.73163658
      }
    }

Aliases for `/me`

    /me/wallet
    /me/balance

List of orders created by the server.

    /me/orders

### Orders

Server takes some time to load and set up connections. You can see the list of currently accessible orders under:

    GET /orders

This endpoint provides full CRUD.

Create order:

    POST /orders

    {
      "buyCurrency": "ETH",
      "sellCurrency": "BTC",
      "buyAmount": 1,
      "sellAmount": 0.1
    }

Delete order:

    DELETE /orders/:id

See order:

    GET /orders/:id

### Orders interaction

Start Swap


    GET /orders/:id/start-swap

Check Swap status


    GET /orders/:id/status

Sign Swap


    GET /orders/:id/sign-swap

Submit secret


    GET /orders/:id/submit-secret



For more examples, see tests:

## Testing

Run tests from `server/test` directory

    npm run test-api
