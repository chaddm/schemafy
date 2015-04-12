"use strict";

var _ = require('lodash');
var crypto = require('crypto');
var log = require('./log');
var JsonSchema = require('jsonschema');

function toBooleanOrUndefined(value) {
  switch (typeof value) {
    case 'boolean':
      break;
    case 'string':
      value = value.toString().match(/^\W*(false|f|no|n|0)\W*$/i) ? false : true;
    break;
    case 'number':
      case 'function':
      case 'object':
      value = Boolean(value);
    break;
    default:
      value = undefined;
  }
  return value;
}

function process(schema, path, source, provideUnrequired) {
  var blank = {};
  var schemaDefault = schema['default'];
  var value;

  if (!schema || typeof schema !== 'object') {
    throw ('Missing schema object for ' + path + '.');
  }

  switch (schema.type) {
    case 'string':
      // Use first item of array, allows converted XML as source.
      if (_.isArray(source) && source.length === 1) {
      source = source[0];
    }
    if (typeof source === 'undefined' || source === null) {
      if (schema.enumeration &&
          schema.enumeration.length === 1 &&
            schemaDefault !== schema.enumeration[0]) {
        log.warn(
          'Auto-correcting default for ' +
            path +
            ' from "' +
            schemaDefault +
            '" to "' +
            schema.enumeration[0] +
            '".');
          value = schema.enumeration[0].toString();
      } else if (typeof (schemaDefault) === 'undefined' || schemaDefault === null) {
        value = '';
      } else {
        value = schemaDefault.toString();
      }
    } else {
      value = source.toString();
    }
    return value;
    case 'number':
      case 'integer':
      // Use first item of array, allows converted XML as source.
      if (_.isArray(source) && source.length === 1) {
      source = source[0];
    }
    value = Number(source);
    if (isNaN(value)) {
      value = schemaDefault === undefined ? 0 : Number(schemaDefault);
    }
    return value;
    case 'boolean':
      // Use first item of array, allows converted XML as source.
      if (_.isArray(source) && source.length === 1) {
      source = source[0];
    }
    value = toBooleanOrUndefined(source);
    if (value === undefined) {
      value = toBooleanOrUndefined(schemaDefault) || false;
    }
    return value;
    case 'array':
      if (!_.isArray(schemaDefault)) {
      schemaDefault = _.toArray(schemaDefault);
    }
    if (_.isArray(schema.items)) {
      throw ('Array with toupled definition is not supported for ' + path + '.');
    }
    if (schema.items === undefined) {
      throw ('Array ' + path + ' requires items to be defined.');
    }
    value = (_.isArray(source) && source.length !== 0 && source || schemaDefault).map(function mapper(entry) {
      return process(schema.items, path + '[].', entry);
    });
    return _.clone(value, true) || [];
    case 'null':
      return null;
    case 'object':
      // Use first item of array, allows converted XML as source.
      if (_.isArray(source) && source.length === 1) {
      source = source[0];
    }
    // If no schema defined, use source or default.
    if (schema.properties === undefined) {
      if (source) {
        blank = source;
      } else {
        blank = _.merge({}, schemaDefault) || {};
      }
    } else {
      // Otherwise, use definition to process properties.
      _(schema.properties || {}).forEach(function processProperty(value, key) {
        if (provideUnrequired || (schema.properties[key] && schema.properties[key].required === true || false) || (source && source.hasOwnProperty(key))) {
          blank[key] = process(schema.properties[key], path + '.' + key, source && source[key], provideUnrequired);
        }
      }).value();
    }
    return blank;
    default:
      throw ('Cannot build from type "' + schema.type + '" for ' + path + '.');
  }
}

function validate(schema, data) {
  var _errors = [];
  var jsonSchemaErrors = (new JsonSchema.Validator()).validate(data, schema);
  jsonSchemaErrors
    .errors
    .forEach(function accumulateErrorMessages(error) {
      var message = (typeof error === 'object') && (error.property + " " + error.message) || error;
      _errors.push(message);
    });
  // JSON Schema can generate dup warning messages for enums.  For now, suppressing here.
  return _.uniq(_errors);
}

function overwriteArrays(destination, source) {
  return _.isArray(destination) ? source : undefined;
}

function SchemaGenerator() {
  var args = [].slice.call(arguments, 0).concat({});
  var schemaName = 'Schema';
  if (typeof args[0] === 'string') {
    schemaName = args[0];
    args.shift();
  }
  var definition = _.reduce(args, function mergeDefinitionExtensionAndArrays(extention, definition) {
    return _.merge(definition, extention, overwriteArrays);
  }, {
    "type": "object",
    "additionalProperties": false,
    "properties": {}
  });
  var validators = [];

  var __Schema = {};
  /* jshint evil:true */
  eval("__Schema = function " + schemaName + "(source) { if (source !== false) { _.merge(this, process(definition, 'root', source, false)); } };");

  __Schema.schema = function schema() {
    return _.merge({}, definition);
  };
  __Schema.extend = function extend(name, extension) {
    return SchemaGenerator(name, _.merge({}, definition, extension, overwriteArrays ));
  };
  __Schema.validate = function validate_(json) {
    return validate(definition, _.assign({}, json));
  };
  __Schema.addValidation = function addValidation(fn) {
    if(typeof fn !== 'function') {
      throw new Error('Validators must be a function.');
      return;
    }
      validators.push(fn);

  };
  __Schema.prototype.__validate = function __validate() {
    return validate(definition, _.assign({}, this));
  };
  __Schema.prototype.__toJson = function __toJson() {
    return JSON.stringify(this);
  };
  __Schema.prototype.__validHash = function __validHash() {
    var toHash = _.clone(this);
    toHash.hash = '';
    toHash = JSON.stringify(toHash);
    return crypto.createHash('sha1').update(toHash).digest('hex');
  };
  __Schema.prototype.__setHash = function __setHash() {
    this.hash = this.__validHash();
    return this;
  };
  __Schema.prototype.__hasValidHash = function __hasValidHash() {
    return this.hash === this.__validHash();
  };

  return __Schema;
}

SchemaGenerator.validate = validate;
SchemaGenerator.overwriteArrays = overwriteArrays;

module.exports = SchemaGenerator;

