const path      = require('path');
const m         = require('module');
const Service   = require('bi-service');
const sinon     = require('sinon');
const chai      = require('chai');
const sinonChai = require("sinon-chai");
const Bookshelf = require('bookshelf');

var bookshelfBuilder = require('../index.js');

var expect = chai.expect;

chai.use(sinonChai);
chai.should();

describe('loadModels', function() {
    before(function() {
        const self = this;
        this.bookshelf = new bookshelfBuilder({
            connection: {
                host: '127.0.0.1',
            },
            dialect: 'postgres',
        });

        function model1() {}
        model1.prototype.tableName = 'table1';

        function model2() {}
        model2.prototype.tableName = 'table_name2';

        self.model1 = model1;
        self.model2 = model2;

        this.fileIteratorStub = sinon.stub(Service.moduleLoader, 'fileIterator', fileIterator);
        this.bookshelfModelSpy = sinon.spy(this.bookshelf, 'model');


        this.mainModulePath = path.resolve(__dirname + '/../index.js');
        this.mainModule = m._cache[this.mainModulePath];

        this.requireStub = sinon.stub(this.mainModule, 'require');
        this.requireStub.withArgs('dir1/file1').returns(function() {
            return self.model1;
        });
        this.requireStub.withArgs('dir2/file2').returns(function() {
            return self.model2;
        });


        function fileIterator(paths, options, callback) {
            /*
             * fileIterator calls callback for each file found on filesystem
             */
            callback('file1', 'dir1');
            callback('file2', 'dir2');
        };

        this.output = this.bookshelf.loadModels('/dumy/path');
    });

    after(function() {
        this.requireStub.restore();
        this.fileIteratorStub.restore();
        this.bookshelfModelSpy.restore();
    });

    it('should call bookshelf.import for each file ', function() {
        this.bookshelfModelSpy.should.have.been.calledTwice;
        this.bookshelfModelSpy.should.have.been.calledWith('Table1', this.model1);
        this.bookshelfModelSpy.should.have.been.calledWith('TableName2', this.model2);
        this.output.should.have.property('Table1');
        this.output.should.have.property('TableName2');
    });
});

describe('bookshelfBuilder', function() {
    it('should return new Bookshelf object', function() {
        let bookshelf = bookshelfBuilder({
            connection: {
                host: 'localhost',
                db: 'test',
                username: 'root',
            },
            dialect: 'postgres'
        });

        bookshelf.should.have.property('knex');
        bookshelf.should.have.deep.property('knex.client');
        bookshelf.should.have.property('Model');
        bookshelf.should.have.property('Collection');
        bookshelf.should.have.property('VERSION');
    });

    it('should build new Bookshelf object with provided options', function() {

        const options = {
            connection: {
                host: 'localhost',
                db: 'test',
                username: 'root',
                password: 'test',
            },
            dialect: 'postgres',
            pool: {
                min: 10,
                max: 100,
                idle: 10
            }
        };

        const bookshelf = bookshelfBuilder(options);

        bookshelf.knex.client.config.should.be.eql({
            pool: options.pool,
            debug: false,
            connection: {
                host: 'localhost',
                database: 'test',
                user: 'root',
                password: 'test'
            },
            client: 'postgres'
        });
    });
});
