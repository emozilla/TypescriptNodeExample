import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { v4 as uuid } from 'uuid'

import * as low from "lowdb";
import * as FileAsync from "lowdb/adapters/FileAsync";
import * as Memory from "lowdb/adapters/Memory";

import App from '../src/App';
import { exec } from 'child_process';

import { Product } from './../src/models/Product';
import { ProductType } from './../src/models/ProductType';

const app = new App();
chai.use(chaiHttp);
const expect = chai.expect;

describe('ProductType API Routes', () => {

    app.db.get('ProductType')
    .push({
        id: '5973a941-4125-44f8-b0f2-eba963339e03',
        description: 'Automotive',
    },{
        id: '40b1a5e3-0684-4e19-bd96-3cc059660b8c',
        description: 'Books',
    }, {
        id: '0f01c1cc-b6a8-4b41-86bc-4325c7f9eabd',
        description: 'Electronics',
    }, new ProductType("Food"), new ProductType("Clothing")).write();

    describe('GET /types', function() {
        it('Returns a list of product types', function(done) {
            chai.request(app.express).get('/types').end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf(5);
                done();
            });            
        });
    });

    describe('GET /types/:id', function() {
        it('Returns the Product Type', function(done) {
            chai.request(app.express).get('/types/40b1a5e3-0684-4e19-bd96-3cc059660b8c').end(function(err, res) {
                expect(res.body).to.be.an('object');
                done();
            });            
        });
        it('Returns 404 if does not exists', function(done) {
            chai.request(app.express).get('/types/40b1a5e3-0684-4e19-bd96-3cc059660b9c').end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });            
        });
        
    });

    describe('POST /types/', function() {
        it('Returns the Product Type created', function(done) {
            chai.request(app.express).post('/types/').send({ description: 'Furniture'}).end(function(err, res) {
                expect(res.body).to.be.an('object');
                done();
            });            
        });
        it('Returns 400 if request is invalid', function(done) {
            chai.request(app.express).post('/types/').send({ name: 'Furniture'}).end(function(err, res) {
                expect(res).to.have.status(400);
                done();
            });            
        });

        it('Returns 5 elements of product types', function(done) {
            chai.request(app.express).get('/types').end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf(6);
                done();
            });            
        });
    });

    describe('PUT /types/:id', function() {
        it('Returns the Product Type modified', function(done) {
            chai.request(app.express).put('/types/5973a941-4125-44f8-b0f2-eba963339e03').send({ description: 'Vegetables'}).end(function(err, res) {
                expect(res.body).to.be.an('object');
                done();
            });            
        });
        it('Returns 404 if Product Type not found', function(done) {
            chai.request(app.express).put('/types/40b1a5e3-0684-4e19-bd96-3cc059660b9c').send({ description: 'Vegetables'}).end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });            
        });
        it('Returns 400 if params are invalid', function(done) {
            chai.request(app.express).put('/types/5973a941-4125-44f8-b0f2-eba963339e03').send({ name: 'Vegetables'}).end(function(err, res) {
                expect(res).to.have.status(400);
                done();
            });            
        });
        it('Returns 5 elements of product types', function(done) {
            chai.request(app.express).get('/types').end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf(6);
                done();
            });            
        });
    });

    describe('DELETE /types/:id', function() {
        it('Returns the Product Type deleted', function(done) {
            chai.request(app.express).del('/types/5973a941-4125-44f8-b0f2-eba963339e03').end(function(err, res) {
                expect(res.body).to.be.an('object');
                done();
            });            
        });
        it('Returns 404 if Product Type not found', function(done) {
            chai.request(app.express).del('/types/5973a941-4125-44f8-b0f2-eba963339e03').end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });            
        });
        it('Returns 4 elements of product types', function(done) {
            chai.request(app.express).get('/types').end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf(5);
                done();
            });            
        });
    });

});

describe('Product API Routes', () => {

    let electronics = Object.assign(new ProductType(""), 
        app.db.get('ProductType').find({ id: "0f01c1cc-b6a8-4b41-86bc-4325c7f9eabd" }).value());

    app.db.get('Product')
    .push({
        id: '9ab052f0-e5ab-4960-9a02-9e735af30df2',
        name: 'The Pragmatic Programmer',
        type: '40b1a5e3-0684-4e19-bd96-3cc059660b8c',
    }, {
        id: '4144af54-4ad3-4eb4-a250-424cfae0e76f',
        name: 'The Art of Computer Programming',
        type: '40b1a5e3-0684-4e19-bd96-3cc059660b8c',
    },{
        id: '3b563c6a-f142-44f7-9205-16124a7959cf',
        name: 'Programming Pearls',
        type: '40b1a5e3-0684-4e19-bd96-3cc059660b8c',
    },
    new Product("iPod", electronics), 
    new Product("Laptop", electronics),
    new Product("Headphones", electronics),
    new Product("Hard drive", electronics),
    new Product("Speaker", electronics),
    new Product("Mouse", electronics),
    new Product("Monitor", electronics)).write();

    describe('POST /products', function() {
        it('Returns the Product created', function(done) {
            chai.request(app.express).post('/products').send({ name: 'iPad', type: "0f01c1cc-b6a8-4b41-86bc-4325c7f9eabd"}).end(function(err, res) {
                expect(res).to.have.status(200);                
                expect(res.body).to.be.an('object');
                done();
            });            
        });
        it('Returns 400 if request is invalid (invalid fields)', function(done) {
            chai.request(app.express).post('/products/').send({ description: 'iPad', type: "0f01c1cc-b6a8-4b41-86bc-4325c7f9eabd"}).end(function(err, res) {
                expect(res).to.have.status(400);
                done();
            });            
        });
        it('Returns 400 if request is invalid (invalid product type)', function(done) {
            chai.request(app.express).post('/products/').send({ name: 'iPad', type: "0f01c1cc-b6a8-4b41-86bc-4325c7f9ea10"}).end(function(err, res) {
                expect(res).to.have.status(400);
                done();
            });            
        });
    });

    describe('PUT /products/:id', function() {
        
        it('Returns the Product modified (type)', function(done) {
            chai.request(app.express).put('/products/9ab052f0-e5ab-4960-9a02-9e735af30df2').send({ type: "0f01c1cc-b6a8-4b41-86bc-4325c7f9eabd"}).end(function(err, res) {
                expect(res).to.have.status(200);                
                expect(res.body).to.be.an('object');
                done();
            });            
        });

        it('Returns the Product modified (name)', function(done) {
            chai.request(app.express).put('/products/9ab052f0-e5ab-4960-9a02-9e735af30df2').send({ name: "Camera"}).end(function(err, res) {
                expect(res).to.have.status(200);                
                expect(res.body).to.be.an('object');
                done();
            });            
        });

        it('Returns 400 if request is invalid (invalid fields)', function(done) {
            chai.request(app.express).put('/products/9ab052f0-e5ab-4960-9a02-9e735af30df2').send({ description: 'iPad', id: "0f01c1cc-b6a8-4b41-86bc-4325c7f9eabd"}).end(function(err, res) {
                expect(res).to.have.status(400);
                done();
            });            
        });

        it('Returns 400 if request is invalid (invalid type)', function(done) {
            chai.request(app.express).put('/products/9ab052f0-e5ab-4960-9a02-9e735af30df2').send({ name: "Phone", type: "0f01c1cc-b6a8-4b41-86bc-4325c7f9ea12" }).end(function(err, res) {
                expect(res).to.have.status(400);
                done();
            });            
        });
       
    });

    describe('DELETE /products/:id', function() {
        it('Returns the Product deleted', function(done) {
            chai.request(app.express).del('/products/4144af54-4ad3-4eb4-a250-424cfae0e76f').end(function(err, res) {
                expect(res.body).to.be.an('object');
                done();
            });            
        });
        it('Returns 404 if Product Type not found', function(done) {
            chai.request(app.express).del('/products/4144af54-4ad3-4eb4-a250-424cfae0e76f').end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });            
        });
    });

    describe('GET /products/:id', function() {

        it('Returns the Product', function(done) {
            chai.request(app.express).get('/products/3b563c6a-f142-44f7-9205-16124a7959cf').end(function(err, res) {
                expect(res.body).to.be.an('object');
                done();
            });            
        });
        it('Returns the Product with deep = 1', function(done) {
            chai.request(app.express).get('/products/3b563c6a-f142-44f7-9205-16124a7959cf').send({deep: 1}).end(function(err, res) {
                expect(res.body).to.deep.include({ type: { id: '40b1a5e3-0684-4e19-bd96-3cc059660b8c', description: 'Books' }});
                done();
            });            
        });
        it('Returns 404 if does not exists', function(done) {
            chai.request(app.express).get('/products/40b1a5e3-0684-4e19-bd96-3cc059660b9c').end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });            
        });
    });

    describe('GET /products', function() {

        it('Returns a list of products', function(done) {
            chai.request(app.express).get('/products').end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });            
        });

        it('Returns a paginated list of products', function(done) {
            chai.request(app.express).get('/products').query({page: 2, size: 3}).end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf(3);
                done();
            });            
        });
        
    });

});



