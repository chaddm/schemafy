var _ = require('lodash');
var expect = require('chai').expect;
var Schemafy;
var Group;
var group;

function propertiesOnly(json) {
  return _.merge({}, json);
}

describe('lib/schema', function () {

  beforeEach(function () {
    Schemafy = undefined;
    Group = undefined;
    group = undefined;

    Schemafy = require('../src/schemafy');
  });

  it('is defined', function () {
    expect(Schemafy).to.exist;
  });

  it('is a function', function () {
    expect(Schemafy).to.be.a('function');
  });

  describe('when called to create a Group schema', function () {
    beforeEach(function () {
      Group = new Schemafy({
        "type": "object",
        "id": "group",
        "required": true,
        "additionalProperties": false,
        "properties": {
          "id": {
            "description": "Universally unique identifier",
            "type": "string",
            "required": true
          }
        }
      });
    });

    describe('Group schema', function () {
      it('has properties created with Schemafy', function () {
        expect(Group.schema()).to.deep.equal({
          "type": "object",
          "id": "group",
          "required": true,
          "additionalProperties": false,
          "properties": {
            "id": {
              "description": "Universally unique identifier",
              "type": "string",
              "required": true
            }
          }
        });
      });

      describe('when Group is used to instantiate a new group', function () {
        beforeEach(function () {
          group = new Group();
        });

        it('returns instance of Group', function () {
          expect(group).to.be.instanceof(Group);
        });

        describe('group instance', function () {
          it('has default properties from Group schema', function () {
            expect(_.merge({}, group)).to.deep.equal({
              id: ''
            });
          });
          it('returns errors with __validate', function () {
            expect(group.__validate()).to.deep.equal([]);
          });
          it('returns string for __toJson', function () {
            expect(group.__toJson()).to.equal("{\"id\":\"\"}");
          });
        });
      });

      describe('when Group is used to instantiate a blank group', function () {
        beforeEach(function () {
          group = new Group(false);
        });

        it('returns instance of Group', function () {
          expect(group).to.be.instanceof(Group);
        });

        describe('group instance', function () {
          it('has default properties from Group schema', function () {
            expect(propertiesOnly(group)).to.deep.equal({});
          });
          it('returns errors with __validate', function () {
            expect(group.__validate()).to.deep.equal([
              "instance.id is required"
            ]);
          });
          it('returns string for __toJson', function () {
            expect(group.__toJson()).to.equal("{}");
          });
        });
      });
    });
  });

});
