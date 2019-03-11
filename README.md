
Bookshelf with `registry` & `virtuals` & `visibility` & `pagination` & `paranoia` & `eloquent` plugins.  

```javascript
const Service = require('serviser');
const config = require('serviser-config');
const bookshelfBuilder = require('serviser-bookshelf');

const bookshelf = bookshelfBuilder({/*knex options*/});

const service = new Service(config);

//enables integrity inspection features
service.resourceManager.register('postgres', bookshelf);


//instantiates model definitions and registers them with  the `registry` plugin interface
//returns object with loaded models
bookshelf.loadModels([
    'path/to/directory/with/model/definitions'
]);
```

Model definition example eg.: `lib/models/orm/user.js`  

```javascript

module.exports = function(bookshelf) {

    return bookshelf.Model.extend({
        tableName: 'user'
    });
};
```
