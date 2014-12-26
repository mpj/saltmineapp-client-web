var mout = require('mout');

function app(opts, facade) {

  var state = {
    view: {
      masterPassword: '',
      domainName: '',
      username: ''
    }
  }

   function render() {
    facade.render({
      username: state.view.username,
      masterPassword: state.view.masterPassword
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
      facade.putDomainName(domainName, state.view.username, state.view.masterPassword);
      render();
    },
    init: function() {
      render();
    }
  }
}
module.exports = app;
