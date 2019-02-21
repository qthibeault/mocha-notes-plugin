mocha-notes-plugin
==================
A plugin that allows you to save notes for each Test which are reported with the results at the end

Installation
------------
`npm install --save-dev mocha mocha-notes-plugin`

_This library is tested to work with Mocha 6.0.0_

```json
{
    "scripts": {
        "test": "node node_modules/mocha/bin/_mocha --require mocha-notes-plugin --reporter mocha-notes-plugin/lib/repoter.js"
    }
}
```

Example Usage
-------------
```js
const { expect } = require('chai')

describe('Suite', function() {
    it('Should run a test', function() {
        this.test.note('foo', 'bar')
        this.test.note('answer', 42)

        expect(true).to.be.true
    })
})
```

How it Works
------------
This module monkey-patches the `Test` class to expose a method called `note`. This method appends key value pairs
to a private object calles `notes`. The custom reporter packaged with this plugin adapts the JSON reporter to display
the notes in the output. 
