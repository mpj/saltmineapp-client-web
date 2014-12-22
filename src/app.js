var mout = require('mout');

function app(opts, facade) {

  var state = {
    view: {
      masterPassword: '',
      domainName: '',
      username: ''
    }
  }
  function storeHash() {
    return facade.hash(state.view.masterPassword+state.view.username)
  }

  function render() {
    facade.render({
      generatedPasswordValue: facade.hash(state.view.masterPassword+state.view.domainName)
    })
    console.log("storeHash is", storeHash());
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
      facade.insertDomainName(domainName);
      render();
    },
    init: function() {
      render();
    }
  }
}
module.exports = app;
