var mout = require('mout');

function app(opts, facade) {

  var state = {
    view: {
      masterPassword: '',
      domainName: '',
      username: '',
      generatedPassword: ''
    }
  }

   function render() {
    facade.render({
      generatedPasswordValue: state.view.generatedPassword
    })
  }
  return {
    viewUpdatedMasterPassword: function(masterPassword) {
      state.view.masterPassword = masterPassword;
      render();
    },
    viewUpdatedUsername: function(username) {
      state.view.username = username;
      render();
    },
    viewUpdatedDomainName: function(domainName) {
      state.view.domainName = domainName;
      facade.putDomainName(domainName, state.view.username, state.view.masterPassword, function(error, result) {
        state.view.generatedPassword = result.generatedPassword;
        render();
      });
      render();
    },
    viewQueriedDomains: function(query, callback) {
      if (!query.length || query.length < 3 || !state.view.username || !state.view.masterPassword) return callback([]);
      facade.queryDomains(query, state.view.username, state.view.masterPassword, function(error, result) {
        if (error) {
          console.warn(error);
        } else {
          callback(result);
        }
      });

    },
    init: function() {
      render();
    }
  }
}
module.exports = app;
