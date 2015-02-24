/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#/documentation/concepts/ORM
 */

module.exports.models = {

  /***************************************************************************
  *                                                                          *
  * Your app's default connection. i.e. the name of one of your app's        *
  * connections (see `config/connections.js`)                                *
  *                                                                          *
  ***************************************************************************/
  connection: 'someMongodbServer',

  /***************************************************************************
  *                                                                          *
  * How and whether Sails will attempt to automatically rebuild the          *
  * tables/collections/etc. in your schema.                                  *
  *                                                                          *
  * See http://sailsjs.org/#/documentation/concepts/ORM/model-settings.html  *
  *                                                                          *
  ***************************************************************************/
  migrate: 'alter',

  /**
   * This method adds records to the database
   *
   * To use add a variable 'seedData' in your model and call the
   * method in the bootstrap.js file
   */
  seed: function (callback) {
    var self = this;
    var modelName = self.adapter.identity.charAt(0).toUpperCase() + self.adapter.identity.slice(1);
    if (!self.seedData) {
      sails.log.debug('No data avaliable to seed ' + modelName);
      callback();
      return;
    }
    self.count().exec(function (err, count) {
      if (!err && count === 0) {
        sails.log.debug('Seeding ' + modelName + '...');
        if (self.seedData instanceof Array) {
          self.seedArray(callback);
        }else{
          self.seedObject(self.seedData, callback);
        }
      } else {
        sails.log.debug(modelName + ' had models, so no seed needed');
        callback(err);
      }
    });
  },
  seedArray: function (callback) {
    var self = this;
    async.eachSeries(self.seedData,self.seedObject,callback);

    return;

    var modelName = self.adapter.identity.charAt(0).toUpperCase() + self.adapter.identity.slice(1);
    self.createEach(self.seedData).exec(function (err, results) {
      if (err) {
        sails.log.debug(err);
        callback(err);
      } else {
        sails.log.debug(modelName + ' seed planted');
        callback();
      }
    });
  },
  seedObject: function (obj,callback) {
    var self = this;
    var modelName = self.adapter.identity.charAt(0).toUpperCase() + self.adapter.identity.slice(1);
    self.create(obj).exec(function (err, results) {
      if (err) {
        sails.log.debug(err);
        callback(err);
      } else {
        sails.log.debug(modelName + ' seed planted');
        callback();
      }
    });

  }

};
