
var _ = require('lodash');
var expect = require('chai').expect;
var Schemafy;

function propertiesOnly(json) {
  return _.merge({}, json);
}

describe('Loading Schemafy', function () {

  beforeEach(function () {
    Schemafy = require('../src/schemafy');
  });

  it('is defined', function () {
    expect(Schemafy).to.exist;
  });

  it('is a function', function () {
    expect(Schemafy).to.be.a('function');
  });

});
