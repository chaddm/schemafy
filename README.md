v0.5
--

*TL;DR: Schemafy is a library for creating schemas, creating POJOs (Plain Old JavaScript Objects) from schemas, and validating POJOs against schemas.*

----------

*Why Schemafy?*
--

Schemafy was built to solve a problem: we wanted to be able to save document data, but not worry about trying to keep the structure up-to-date.  Normally, schemas are used to enforced structure in a database.  When a schema is changed, the database restructures everything, which takes time and risks data corruption.  We figured: If we never read the data again, why bother updating it?  Schemafy let us to load data and on-the-fly have it conform to a schema.

*What can you do?*
--

- Define schemas with the JSON Schema standard with syntatic constraints, like type, range, and default value.
- Create blank POJOs from a schema, where required properties are created automatically with default values.
- Create POJOs from JSON data, where undefined properties are dropped and non-conforming data is coerced.

----------

### Installation

Include Schemafy in your project:

```sh
$ npm install schemafy --save
```
#### NodeJs and in the browser with browserify
Use `require("schemafy")`.

#### In the browser with AMD
Schemafy defines "schemafy," and dependencies "lodash" and "jsonschema" must be defined.

----------

### Usage

Full documentation is available at [chaddm.github.io/schemafy](https://chaddm.github.io/schemafy).

#### Create a Person schema:
```javascript
var Schemafy = require('schemafy')

var Person = Schemafy("Person", {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        type: "number",
        required: true,
        min: 0
      },
      username: {
        type: "string",
        required: true,
        minLength: 1,
      }
    }
  });
```

#### Create a blank POJO of Person:

```javascript
var person = new Person();
  // => { id: 0, username: "" }
var isPerson = person instanceof Person
  // => true
```

#### Create a POJO from a source, with coercion:

```javascript
var person = new Person({
    id: "123",
    username: "woot"
  });
  // => { id: 123, username: "woot" }
```

#### Create a POJO from a source, without coercion, and validate:

```javascript
var person = new Person({
    id: "123",
    username: "woot"
  }, {
    coerce: false
  });
  // => { id: "123", username: "woot" }
person.__validate()
  // => [ "instance.id is not of type(s) number" ]
```

----------

Contribution, Issues
--

Please join us on GitHub at [chaddm/schemafy](https://github.com/chaddm/schemafy).

----------

License
----

MIT -  *Join the abode, share some code.*

