'use strict';

var _ = require('lodash');
var crypto = require('crypto');
var log = require('./log');
var JsonSchema = require('jsonschema');

function toBoolean(value) {
  switch (typeof value) {
    case 'boolean':
      break;
    case 'string':
      value = value.toString().match(/^\W*(false|f|no|n|0)\W*$/i) ? false : true;
      break;
    default:
      value = Boolean(value);
  }
  return value;
}

function process(schema, path, source, options) {
  var blank = {};
  var schemaDefault = schema['default'];
  var schemaDefaultIsUndefined = typeof(schemaDefault) === 'undefined';
  var sourceIsUndefined = typeof(source) === 'undefined';
  var value;

  if (!schema || typeof schema !== 'object') {
    throw ('Missing schema object for ' + path + '.');
  }

  switch (schema.type) {
    case 'string':
      if (sourceIsUndefined) {
        value = schemaDefaultIsUndefined ? '' : schemaDefault;
      } else {
        value = options.coerce && source.toString() || source;
      }
      return value;
    case 'number':
    case 'integer':
      if (sourceIsUndefined) {
        value = schemaDefaultIsUndefined ? 0 : schemaDefault;
      } else {
        if (options.coerce) {
          value = options.coerce && Number(source);
        } else {
          value = source;
        }
      }
      if (isNaN(value)) {
        value = 0;
      }
      return value;
    case 'boolean':
      if (sourceIsUndefined) {
        value = schemaDefaultIsUndefined ? false : schemaDefault;
      } else {
        if (options.coerce) {
          value = options.coerce && toBoolean(source);
        } else {
          value = source;
        }
      }
      return value;
    case 'array':
      // TODO - Add support for JSON Schema tupals
      if (_.isArray(schema.items)) {
        throw ('Array with toupled definition is not supported for ' + path + '.');
      }
      // TODO - Maybe there is a better way to handle arrays without defined items.
      if (schema.items === undefined) {
        throw ('Array ' + path + ' requires items to be defined.');
      }
      if (sourceIsUndefined) {
        value = schemaDefaultIsUndefined ? [] : schemaDefault;
      } else {
        if (options.coerce) {
          value = options.coerce && _.toArray(source);
        } else {
          value = source;
        }
      }
      if (_.isArray(value)) {
        value = value.map(function mapper(entry) {
          return process(schema.items, path + '[].', entry, options);
        });
        return _.clone(value, true);
      }
      return value;
    case 'null':
      if (sourceIsUndefined) {
        value = schemaDefaultIsUndefined ? null : schemaDefault;
      } else {
        if (options.coerce) {
          value = null;
        } else {
          value = source;
        }
      }
      return value;
    case 'object':
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
          if (options.createAll || (schema.properties[key] && schema.properties[key].required === true || false) || (source && source.hasOwnProperty(key))) {
            blank[key] = process(schema.properties[key], path + '.' + key, source && source[key], options);
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
  // TODO: JSON Schema can generate dup warning messages for enums.  For now, suppressing here.
  return _.uniq(_errors);
}

function overwriteArrays(destination, source) {
  return _.isArray(destination) ? source : undefined;
}

function SchemaGenerator() {
  var args = [].slice.call(arguments, 0).concat({});
  var schemaName = 'SchemafySchema';
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

  var __Schema = {};

  function instantiator(source, options) {
    source = source || {};
    options = options || {};
    _.merge(this, process(definition, "root", source, options));
  }

  /* jshint evil:true */
  eval('__Schema = function ' + schemaName + '() {' +
    '  instantiator.apply(this, Array.prototype.slice.call(arguments, 0));' +
    '};'
  );

  __Schema.schema = function schema() {
    return _.merge({}, definition);
  };
  __Schema.extend = function extend(name, extension) {
    return SchemaGenerator(name, _.merge({}, definition, extension, overwriteArrays));
  };
  __Schema.validate = function validate_(json) {
    return validate(definition, _.assign({}, json));
  };
  __Schema.prototype.__validate = function __validate() {
    return validate(definition, _.assign({}, this));
  };
  __Schema.prototype.__toJson = function __toJson() {
    return JSON.stringify(this);
  };

  return __Schema;
}

SchemaGenerator.validate = validate;
SchemaGenerator.overwriteArrays = overwriteArrays;

module.exports = SchemaGenerator;
