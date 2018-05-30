//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let { app, server } = require('../app')
let should = chai.should()

chai.use(chaiHttp)

before((done) => setTimeout(done, 3000))

describe('Wallet', () => {

  // beforeEach((done) => setTimeout(done, 3000))

  describe('/me endpoint', () => {

    it('should GET balance', (done) => {

      chai.request(server)
        .get('/me/balance')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.balances.should.not.be.eql(0)
          
          console.log('body', res.body)
          // res.body.length.should.be.eql(0)
          done()
        })

    })
  })
})

describe('Orders', () => {

  // beforeEach((done) => setTimeout(done, 3000))

  describe('/orders endpoint', () => {

    it('should GET list of orders', (done) => {

      chai.request(server)
        .get('/orders')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          // res.body.length.should.be.eql(0);
          done()
        })

    })
  })
})
