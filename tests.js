const request = require('supertest')
const app = require('./index.js');
const chai = require('chai')
const expect = chai.expect

 


    describe('Successes', function() {
        it('Return the product if the product name is valid', function(done) {
            request(app).get('/healthz').send({ }).end(function(err, res) {
                expect(res.statusCode).to.be.equal(200)
                done()
            })
        })
    })