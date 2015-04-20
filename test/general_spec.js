'use strict';

var Schemafy = require('../src/schemafy'),
    expect = require('chai').expect;

describe('Schemafy', function () {
    var lambda;
    var TestSchema;
    var data;
    var results;
    beforeEach(function () {
        lambda = undefined;
        TestSchema = undefined;
        data = undefined;
        results = undefined;
    });
    describe('Defining a new, anonymous schema', function () {
        describe('When called with no parameters', function () {
            beforeEach(function () {
                lambda = function () {
                    return Schemafy();
                };
            });
            it('does not generate an error', function () {
                expect(lambda).to.not.throw();
            });
            it('returns a function', function () {
                expect(lambda()).to.be.a('function');
            });
            it('returns a function named "SchemafySchema"', function () {
                expect(lambda().name).to.equal('SchemafySchema');
            });
        });
    });
    describe('Defining a new, named schema', function () {
        describe('When called with "Account" schema name and no definition', function () {
            beforeEach(function () {
                lambda = function () {
                    return Schemafy('Account');
                };
            });
            it('does not generate an error', function () {
                expect(lambda).to.not.throw();
            });
            it('returns a function', function () {
                expect(lambda()).to.be.a('function');
            });
            it('returns a function named "Account"', function () {
                expect(lambda().name).to.equal('Account');
            });
        });
    });
    describe('Defining an schema', function () {
        describe('When called with a valid definition', function () {
            beforeEach(function () {
                TestSchema = Schemafy('TestSchema', {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                        "string": {
                            "description": "String property",
                            "type": "string",
                            "required": true
                        },
                        "number": {
                            "description": "String property",
                            "type": "number",
                            "required": true
                        },
                        "boolean": {
                            "description": "Boolean property",
                            "type": "boolean",
                            "required": true
                        },
                        "required": {
                            "description": "String property",
                            "type": "string",
                            "required": true
                        },
                        "notRequired": {
                            "description": "String property",
                            "type": "string",
                            "required": false
                        },
                        "objectWithoutDefinition": {
                            "description": "Object without definition property",
                            "type": "object",
                            "required": true
                        }
                    }
                });
            });
            it('returns a function', function () {
                expect(TestSchema).to.be.a('function');
            });
            it('returns a function named "TestSchema"', function () {
                expect(TestSchema.name).to.equal('TestSchema');
            });
            describe('Given a new instantiation TestSchema without default data', function () {
                beforeEach(function () {
                    data = new TestSchema();
                });
                it('returns an object', function () {
                    expect(data).to.be.an('object');
                });
                describe('Default object methods', function () {
                    describe('method .__validate', function () {
                        it('is defined', function () {
                            expect(data.__validate).to.be.a('function');
                        });
                        it('returns array with no errors', function () {
                            expect(data.__validate()).to.deep.equal([]);
                        });
                    });
                    describe('method .__toJson', function () {
                        it('is defined', function () {
                            expect(data.__toJson).to.be.a('function');
                        });
                        it('returns JSON representation of data', function () {
                            expect(data.__toJson()).to.equal('{"string":"","number":0,"boolean":false,"required":"","objectWithoutDefinition":{}}');
                        });
                    });
                });
                describe('default object properties', function () {
                    it('has "string" as string', function () {
                        expect(data.string).to.be.a('string');
                    });
                    it('has "number" as number', function () {
                        expect(data.number).to.be.a('number');
                    });
                    it('has "required" as a required element', function () {
                        expect(data.required).to.not.be.undefined;
                    });
                    it('does not have "notRequired" as a not required eleement', function () {
                        expect(data.notRequired).to.be.undefined;
                    });
                });
            });
            describe('Given a new instantiation TestSchema with default data', function () {
                beforeEach(function () {
                    data = new TestSchema({
                        "string": "stringy",
                        "number": 123,
                        "boolean": true,
                        "notRequired": "not required",
                        "objectWithoutDefinition": {
                            "foo": "bar"
                        }
                    });
                });
                it('returns an object', function () {
                    expect(data).to.be.an('object');
                });
                describe('Default object methods', function () {
                    describe('method .__validate', function () {
                        it('is defined', function () {
                            expect(data.__validate).to.be.a('function');
                        });
                        it('returns array with no errors', function () {
                            expect(data.__validate()).to.deep.equal([]);
                        });
                    });
                    describe('method .__toJson', function () {
                        it('is defined', function () {
                            expect(data.__toJson).to.be.a('function');
                        });
                        it('returns JSON representation of data', function () {
                            expect(data.__toJson()).to.equal('{"string":"stringy","number":123,"boolean":true,"required":"","notRequired":"not required","objectWithoutDefinition":{"foo":"bar"}}');
                        });
                    });
                });
                describe('default object properties', function () {
                    it('has "string" as string', function () {
                        expect(data.string).to.be.a('string');
                    });
                    it('has "number" as number', function () {
                        expect(data.number).to.equal(123);
                    });
                    it('defaults "required" to empty string', function () {
                        expect(data.required).to.equal('');
                    });
                    it('has "notRequired" as "not required"', function () {
                        expect(data.notRequired).to.equal('not required');
                    });
                    it('has "objectWithoutDefinition" as {"foo":"bar"}', function () {
                        expect(data.objectWithoutDefinition).to.deep.equal({
                            foo: "bar"
                        });
                    });
                });
            });
        });
    });
});

