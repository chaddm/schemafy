var _ = require('lodash');
var expect = require('chai').expect;
var Schemafy;
var Group;
var group;

function propertiesOnly(json) {
  return _.merge({}, json);
}

describe('Schemafy', function() {

  beforeEach(function() {
    Schemafy = undefined;
    Group = undefined;
    group = undefined;

    Schemafy = require('../src/schemafy');
  });

  it('is defined', function() {
    expect(Schemafy).to.exist;
  });

  it('is a function', function() {
    expect(Schemafy).to.be.a('function');
  });

  describe('when called to create a Group schema', function() {
    beforeEach(function() {
      Group = new Schemafy({
        "type": "object",
        "id": "group",
        "required": true,
        "additionalProperties": false,
        "properties": {
          "id": {
            "description": "Universally unique identifier",
            "type": "string",
            "required": true,
            "default": "12345"
          }
        }
      });
    });

    describe('Group schema', function() {
      it('has properties created with Schemafy', function() {
        expect(Group.schema()).to.deep.equal({
          "type": "object",
          "id": "group",
          "required": true,
          "additionalProperties": false,
          "properties": {
            "id": {
              "description": "Universally unique identifier",
              "type": "string",
              "required": true,
              "default": "12345"
            }
          }
        });
      });

      describe('when Group is used to instantiate a new group with no options', function() {
        beforeEach(function() {
          group = new Group();
        });

        it('returns instance of Group', function() {
          expect(group).to.be.instanceof(Group);
        });

        describe('group instance', function() {
          it('has required properties from Group schema', function() {
            expect(_.merge({}, group)).to.deep.equal({
              id: '12345'
            });
          });
          it('returns no errors with __validate', function() {
            expect(group.__validate()).to.deep.equal([]);
          });
          it('returns string for __toJson', function() {
            expect(group.__toJson()).to.equal("{\"id\":\"12345\"}");
          });
        });
      });

      describe('when Group is used to instantiate a new group with default JSON', function() {
        beforeEach(function() {
          group = new Group({
            id: "31415"
          });
        });

        it('returns instance of Group', function() {
          expect(group).to.be.instanceof(Group);
        });

        describe('group instance', function() {
          it('has required properties from Group schema', function() {
            expect(_.merge({}, group)).to.deep.equal({
              id: '31415'
            });
          });
          it('returns no errors with __validate', function() {
            expect(group.__validate()).to.deep.equal([]);
          });
          it('returns string for __toJson', function() {
            expect(group.__toJson()).to.equal("{\"id\":\"31415\"}");
          });
        });
      });

      describe('when Group is used to instantiate a new group with default JSON that has values not in schema', function() {
        beforeEach(function() {
          group = new Group({
            foo: "bar"
          });
        });

        it('returns instance of Group', function() {
          expect(group).to.be.instanceof(Group);
        });

        describe('group instance', function() {
          it('has properties only from Group schema', function() {
            expect(_.merge({}, group)).to.deep.equal({
              id: '12345'
            });
          });
          it('returns no errors with __validate', function() {
            expect(group.__validate()).to.deep.equal([]);
          });
          it('returns string for __toJson', function() {
            expect(group.__toJson()).to.equal("{\"id\":\"12345\"}");
          });
        });
      });

      describe('when Group is created without coercion', function() {
        beforeEach(function() {
          group = new Group({
            id: 31415
          });
        });

        it('returns instance of Group', function() {
          expect(group).to.be.instanceof(Group);
        });

        describe('group instance', function() {
          it('has properties only from Group schema', function() {
            expect(_.merge({}, group)).to.deep.equal({
              id: 31415
            });
          });
          it('returns no errors with __validate', function() {
            expect(group.__validate()).to.deep.equal([
              'instance.id is not of a type(s) string'
            ]);
          });
          it('returns string for __toJson', function() {
            expect(group.__toJson()).to.equal("{\"id\":31415}");
          });
        });
      });

      describe('when Group is created with coercion', function() {
        beforeEach(function() {
          group = new Group({
            id: 31415
          }, {
            coerce: true
          });
        });

        it('returns instance of Group', function() {
          expect(group).to.be.instanceof(Group);
        });

        describe('group instance', function() {
          it('has properties only from Group schema', function() {
            expect(_.merge({}, group)).to.deep.equal({
              id: "31415"
            });
          });
          it('returns no errors with __validate', function() {
            expect(group.__validate()).to.deep.equal([]);
          });
          it('returns string for __toJson', function() {
            expect(group.__toJson()).to.equal("{\"id\":\"31415\"}");
          });
        });
      });

    });
  });

});
