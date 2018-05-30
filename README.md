
Bookshelf with `registry` & `virtuals` & `visibility` & `pagination` & `paranoia` & `eloquent` plugins.  

```javascript
const Service = require('bi-service');
const config = require('bi-config');
const bookshelfBuilder = require('bi-service-bookshelf');

const bookshelf = bookshelfBuilder({/*options*/});

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
