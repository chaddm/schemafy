var _ = require('lodash');
var expect = require('chai').expect;
var Schemafy;
var Group;
var group;
var ExtendedGroup;
var errors;
var lambda;

function propertiesOnly(json) {
  return _.merge({}, json);
}

describe('Schemafy', function() {

  beforeEach(function() {
    Schemafy = undefined;
    Group = undefined;
    group = undefined;
    ExtendedGroup = undefined;
    errors = undefined;
    lambda = undefined;

    Schemafy = require('../src/schemafy');
  });

  it('is defined', function() {
    expect(Schemafy).to.exist;
  });

  it('is a function', function() {
    expect(Schemafy).to.be.a('function');
  });

  describe('when called to create a non-object schema', function(){
    beforeEach(function(){
      lambda = function() {
        new Schemafy({
          "type": "number",
          "required": true
        });
      };
    });

    it('throws an error', function(){
      expect(lambda).to.throw('Root type must be an object');
    });
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
            "type": "string",
            "required": true,
            "default": "12345"
          },
          "value": {
            "type": "number",
            "required": true,
            "default": 43445
          },
          "isTrue": {
            "type": "boolean",
            "required": true,
            "default": false
          }
        }
      });
    });

    describe('Group schema', function() {

      describe('Group schema\'s properties', function() {
        describe('schema', function() {
          it('is a function', function() {
            expect(Group.schema).to.be.a('function');
          });
          it('returns defined schema', function() {
            expect(Group.schema()).to.deep.equal({
              "type": "object",
              "id": "group",
              "required": true,
              "additionalProperties": false,
              "properties": {
                "id": {
                  "type": "string",
                  "required": true,
                  "default": "12345"
                },
                "value": {
                  "type": "number",
                  "required": true,
                  "default": 43445
                },
                "isTrue": {
                  "type": "boolean",
                  "required": true,
                  "default": false
                }
              }
            });
          });
        });

        describe('extend', function() {
          it('is a function', function() {
            expect(Group.extend).to.be.a('function');
          });
          describe('when called with additional schema information', function() {
            beforeEach(function() {
              ExtendedGroup = Group.extend('ExtendedGroup', {
                "type": "object",
                "id": "extendedGroup",
                "required": true,
                "additionalProperties": false,
                "properties": {
                  "list": {
                    "type": "array",
                    "required": true,
                    "items": {
                      "type": "number",
                      "required": true
                    },
                    "default": [1, 2, 3]
                  }
                }
              });
            });
            it('returns an ExtendedGroup schema', function() {
              expect(ExtendedGroup.name).to.equal('ExtendedGroup');
            });
            describe('ExtendedGroup properties', function() {
              describe('schema', function() {
                it('is a function', function() {
                  expect(ExtendedGroup.schema).to.be.a('function');
                });
                it('returns defined schema', function() {
                  expect(ExtendedGroup.schema()).to.deep.equal({
                    "type": "object",
                    "id": "extendedGroup",
                    "required": true,
                    "additionalProperties": false,
                    "properties": {
                      "id": {
                        "type": "string",
                        "required": true,
                        "default": "12345"
                      },
                      "value": {
                        "type": "number",
                        "required": true,
                        "default": 43445
                      },
                      "isTrue": {
                        "type": "boolean",
                        "required": true,
                        "default": false
                      },
                      "list": {
                        "type": "array",
                        "required": true,
                        "items": {
                          "type": "number",
                          "required": true
                        },
                        "default": [1, 2, 3]
                      }
                    }
                  });
                });
              });
            });
          });
        }); // Schema.extend

        describe('validate', function() {
          it('is a function', function() {
            expect(Group.validate).to.be.a('function');
          });

          describe('when called with a valid JSON', function() {
            beforeEach(function() {
              errors = Group.validate({
                id: "foo",
                value: 123,
                isTrue: true
              })
            });
            it('returns no errors', function() {
              expect(errors).to.deep.equal([]);
            });
          });

          describe('when called with a invalid JSON', function() {
            beforeEach(function() {
              errors = Group.validate({
                value: "123",
                isTrue: null
              });
            });
            it('returns no errors', function() {
              expect(errors).to.deep.equal([
                "instance.id is required",
                "instance.value is not of a type(s) number",
                "instance.isTrue is not of a type(s) boolean"
              ]);
            });
          });
        }); // Schema.validate

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
            expect(propertiesOnly(group)).to.deep.equal({
              id: '12345',
              value: 43445,
              isTrue: false
            });
          });
          it('returns no errors with __validate', function() {
            expect(group.__validate()).to.deep.equal([]);
          });
          it('returns string for __toJson', function() {
            expect(group.__toJson()).to.equal("{\"id\":\"12345\",\"value\":43445,\"isTrue\":false}");
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
            expect(propertiesOnly(group)).to.deep.equal({
              id: '31415',
              value: 43445,
              isTrue: false
            });
          });
          it('returns no errors with __validate', function() {
            expect(group.__validate()).to.deep.equal([]);
          });
          it('returns string for __toJson', function() {
            expect(group.__toJson()).to.equal("{\"id\":\"31415\",\"value\":43445,\"isTrue\":false}");
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
            expect(propertiesOnly(group)).to.deep.equal({
              id: '12345',
              value: 43445,
              isTrue: false
            });
          });
          it('returns no errors with __validate', function() {
            expect(group.__validate()).to.deep.equal([]);
          });
          it('returns string for __toJson', function() {
            expect(group.__toJson()).to.equal("{\"id\":\"12345\",\"value\":43445,\"isTrue\":false}");
          });
        });
      });

    });
  });

  describe('instance creation options', function() {
    describe('coercion', function() {

      describe('given a Group with a string', function() {
        beforeEach(function() {
          Group = new Schemafy({
            "type": "object",
            "id": "group",
            "required": true,
            "additionalProperties": false,
            "properties": {
              "id": {
                "type": "string",
                "required": true,
                "default": "12345"
              }
            }
          });
        });

        describe('given a group created without options', function() {
          beforeEach(function() {
            group = new Group({
              id: 31415
            }, {
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: "31415",
              });
            });
            it('returns string error with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group created without coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: 31415
            }, {
              coerce: false
            });
          });

          describe('group instance', function() {
            it('has original value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: 31415,
              });
            });
            it('returns string error with __validate', function() {
              expect(group.__validate()).to.deep.equal([
                'instance.id is not of a type(s) string'
              ]);
            });
          });
        });

        describe('given a group created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "31415"
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: "31415"
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

      }); // Test string

      describe('given a Group with a number', function() {
        beforeEach(function() {
          Group = new Schemafy({
            "type": "object",
            "id": "group",
            "required": true,
            "additionalProperties": false,
            "properties": {
              "id": {
                "type": "number",
                "required": true,
                "default": 12345
              }
            }
          });
        });

        describe('given a group created without coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "31415"
            }, {
              coerce: false
            });
          });

          describe('group instance', function() {
            it('has original value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: "31415",
              });
            });
            it('returns number error with __validate', function() {
              expect(group.__validate()).to.deep.equal([
                'instance.id is not of a type(s) number'
              ]);
            });
          });
        });

        describe('given a group with a string is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "31415"
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: 31415
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a boolean is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: false
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: 0
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

      }); // Test number

      describe('given a Group with a boolean', function() {
        beforeEach(function() {
          Group = new Schemafy({
            "type": "object",
            "id": "group",
            "required": true,
            "additionalProperties": false,
            "properties": {
              "id": {
                "type": "boolean",
                "required": true,
                "default": false
              }
            }
          });
        });

        describe('given a group created without coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "31415"
            }, {
              coerce: false
            });
          });

          describe('group instance', function() {
            it('has original value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: "31415",
              });
            });
            it('returns number error with __validate', function() {
              expect(group.__validate()).to.deep.equal([
                'instance.id is not of a type(s) boolean'
              ]);
            });
          });
        });

        describe('given a group with undefined is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: undefined
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: false
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a negative number is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: -1
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: true
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a positive number is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: 1
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: true
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with the number zero is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: 0
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: false
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a string with something other than false words is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "Yes!"
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: true
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a string with word no is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "nO"
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: false
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a string with letter n is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "n"
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: false
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a string with letter f is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "F"
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: false
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a string with word false is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "fAlsE"
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: false
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a string with zero number is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "0"
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: false
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a string with non-zero number is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "31415"
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: true
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a boolean is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: true
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: true
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

      }); // Test boolean

      describe('given a Group with an array and no default', function() {
        beforeEach(function() {
          Group = new Schemafy({
            "type": "object",
            "id": "group",
            "required": true,
            "additionalProperties": false,
            "properties": {
              "ids": {
                "type": "array",
                "required": true,
                "items": {
                  "type": "number",
                  "required": true,
                  "default": 0
                }
              }
            }
          });
        });

        describe('given a group created without a value', function() {
          beforeEach(function() {
            group = new Group({}, {
              coerce: false
            });
          });

          describe('group instance', function() {
            it('has empty array from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                ids: [],
              });
            });
            it('returns number error with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });
      });

      describe('given a Group with an array', function() {
        beforeEach(function() {
          Group = new Schemafy({
            "type": "object",
            "id": "group",
            "required": true,
            "additionalProperties": false,
            "properties": {
              "ids": {
                "type": "array",
                "required": true,
                "items": {
                  "type": "number",
                  "required": true,
                  "default": 0
                },
                "default": [1, 2, 3]
              }
            }
          });
        });

        describe('given a group created without a value', function() {
          beforeEach(function() {
            group = new Group({}, {
              coerce: false
            });
          });

          describe('group instance', function() {
            it('has default value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                ids: [1, 2, 3],
              });
            });
            it('returns number error with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group created without coercion', function() {
          beforeEach(function() {
            group = new Group({
              ids: "31415"
            }, {
              coerce: false
            });
          });

          describe('group instance', function() {
            it('has original value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                ids: "31415",
              });
            });
            it('returns number error with __validate', function() {
              expect(group.__validate()).to.deep.equal([
                'instance.ids is not of a type(s) array'
              ]);
            });
          });
        });

        describe('given a group with an array is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              ids: [4, 5]
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                ids: [4, 5]
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with an array-like object is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              ids: {
                "0": 7,
                "1": 9,
                "2": 11
              }
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                ids: [7, 9, 11]
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

      }); // Test array

      describe('given a Group with a null and a default', function() {
        beforeEach(function() {
          Group = new Schemafy({
            "type": "object",
            "id": "group",
            "required": true,
            "additionalProperties": false,
            "properties": {
              "id": {
                "type": "null",
                "required": true,
                "default": "Woot!"
              }
            }
          });
        });

        describe('given a group created without coercion', function() {
          beforeEach(function() {
            group = new Group({}, {
              coerce: false
            });
          });

          describe('group instance', function() {
            it('has original value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: 'Woot!',
              });
            });
            it('returns number error with __validate', function() {
              expect(group.__validate()).to.deep.equal([
                'instance.id is not of a type(s) null'
              ]);
            });
          });
        });
      });

      describe('given a Group with a null', function() {
        beforeEach(function() {
          Group = new Schemafy({
            "type": "object",
            "id": "group",
            "required": true,
            "additionalProperties": false,
            "properties": {
              "id": {
                "type": "null",
                "required": true
              }
            }
          });
        });

        describe('given a group created without coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "31415"
            }, {
              coerce: false
            });
          });

          describe('group instance', function() {
            it('has original value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: "31415",
              });
            });
            it('returns number error with __validate', function() {
              expect(group.__validate()).to.deep.equal([
                'instance.id is not of a type(s) null'
              ]);
            });
          });
        });

        describe('given a group with undefined is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: undefined
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: null
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a negative number is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: -1
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: null
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a string with something other than false words is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: "Yes!"
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: null
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

        describe('given a group with a boolean is created with coercion', function() {
          beforeEach(function() {
            group = new Group({
              id: true
            }, {
              coerce: true
            });
          });

          describe('group instance', function() {
            it('has coerced value from initializer', function() {
              expect(propertiesOnly(group)).to.deep.equal({
                id: null
              });
            });
            it('returns no with __validate', function() {
              expect(group.__validate()).to.deep.equal([]);
            });
          });
        });

      }); // Test null

    });

  });

});
