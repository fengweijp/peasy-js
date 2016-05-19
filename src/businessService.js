var Command = require('./command');

var BusinessService = (function() {

  "use strict";

  var BusinessService = function(dataProxy) {
    if (this instanceof BusinessService) {
      this.dataProxy = dataProxy;
    } else {
      return new BusinessService(dataProxy);
    }
  };

  BusinessService.prototype = {

    getAllCommand: function() {
      var service = this;
      var context = {};
      return new Command({
        onInitialization: function(done) {
          service._onGetAllCommandInitialization(context, done);
        },
        getRules: function(done) {
          return service._getRulesForGetAll(context, done);
        },
        onValidationSuccess: function(done) {
          return service._getAll(context, done);
        }
      });
    },

    getByIdCommand: function(id) {
      var service = this;
      var context = {};
      return new Command({
        onInitialization: function(done) {
          service._onGetByIdCommandInitialization(id, context, done);
        },
        getRules: function(done) {
          return service._getRulesForGetById(id, context, done);
        },
        onValidationSuccess: function(done) {
          return service._getById(id, context, done);
        }
      });
    },

    insertCommand: function(data) {
      var service = this;
      var context = {};
      return new Command({
        onInitialization: function(done) {
          service._onInsertCommandInitialization(data, context, done);
        },
        getRules: function(done) {
          return service._getRulesForInsert(data, context, done);
        },
        onValidationSuccess: function(done) {
          return service._insert(data, context, done);
        }
      });
    },

    updateCommand: function(data) {
      var service = this;
      var context = {};
      return new Command({
        onInitialization: function(done) {
          service._onUpdateCommandInitialization(data, context, done);
        },
        getRules: function(done) {
          return service._getRulesForUpdate(data, context, done);
        },
        onValidationSuccess: function(done) {
          return service._update(data, context, done);
        }
      });
    },

    removeCommand: function(id) {
      var service = this;
      var context = {};
      return new Command({
        onInitialization: function(done) {
          service._onRemoveCommandInitialization(id, context, done);
        },
        getRules: function(done) {
          return service._getRulesForRemove(id, context, done);
        },
        onValidationSuccess: function(done) {
          return service._remove(id, context, done);
        }
      });
    },

    _getAll: function(context, done) {
      this.dataProxy.getAll(done);
    },

    _getRulesForGetAll: function(context, done) {
      done([]);
    },

    _onGetAllCommandInitialization: function(context, done) {
      done();
    },

    _getById: function(id, context, done) {
      this.dataProxy.getById(id, done);
    },

    _getRulesForGetById: function(id, context, done) {
      done([]);
    },

    _onGetByIdCommandInitialization: function(id, context, done) {
      done();
    },

    _insert: function(data, context, done) {
      this.dataProxy.insert(data, done);
    },

    _getRulesForInsert: function(data, context, done) {
      done([]);
    },

    _onInsertCommandInitialization: function(data, context, done) {
      done();
    },

    _update: function(data, context, done) {
      this.dataProxy.update(data, done);
    },

    _getRulesForUpdate: function(data, context, done) {
      done([]);
    },

    _onUpdateCommandInitialization: function(data, context, done) {
      done();
    },

    _remove: function(id, context, done) {
      this.dataProxy.remove(id, done);
    },

    _getRulesForRemove: function(id, context, done) {
      done([]);
    },

    _onRemoveCommandInitialization: function(id, context, done) {
      done();
    }
  };

  BusinessService.extend = function(options) {

    options = options || {};
    options.params = options.params || ['dataProxy'];
    options.functions = options.functions || [];

    var Extended = function() {
      this.args = arguments;
      var self = this;
      BusinessService.call(this);
      options.params.forEach(function(field, index) {
        self[field] = self.args[index];
      });
    };

    Extended.prototype = new BusinessService();
    var keys = Object.keys(BusinessService.prototype);
    options.functions.forEach(function(config) {
      var name = Object.keys(config)[0];
      if (keys.indexOf(name) === -1) {
        console.warn("The method: '" + name + "' is not an overridable method of BusinessService");
      }
      Extended.prototype[name] = config[name];
    });

    function createCommand(name, options) {
      BusinessService.createCommand(name, Extended, options);
      return {
        createCommand: createCommand,
        service: Extended
      };
    }

    return {
      createCommand: createCommand,
      service: Extended
    };
  };

  BusinessService.createCommand = function(name, service, functions) {
    var onInitialization = '_on' + capitalize(name) + 'Initialization';
    var getRules = '_getRulesFor' + capitalize(name);
    var onValidationSuccess = '_' + name.replace("Command", "");

    function capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    functions = functions || {};

    service.prototype[onInitialization] = functions.onInitialization || function(context, done) {
      done();
    };

    service.prototype[getRules] = functions.getRules || function(context, done) {
      done([]);
    };

    service.prototype[onValidationSuccess] = functions.onValidationSuccess || function(context, done) {
      done();
    };

    service.prototype[name] = function() {
      var self = this;
      var context = {};

      return new Command({
        onInitialization: function(done) {
          self[onInitialization](context, done);
        },
        getRules: function(done) {
          return self[getRules](context, done);
        },
        onValidationSuccess: function(done) {
          return self[onValidationSuccess](context, done);
        }
      });
    };

    return service;
  };

  Object.defineProperty(BusinessService.prototype, "constructor", {
    enumerable: false,
    value: BusinessService
  });

  return BusinessService;

})();

module.exports = BusinessService;
