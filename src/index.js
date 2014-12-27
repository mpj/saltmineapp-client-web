
typeof window !== "undefined" && (window.React = React)

var App = require('./app');
var crypto = require('crypto');
var store = require('store2');

var facade = {}

facade.store = store;

var MainView = React.createClass({
  propTypes: {
    viewModel: React.PropTypes.object.isRequired
  },
  handleMasterPasswordKeyUp: function(event) {
    app.viewUpdatedMasterPassword(event.target.value)
  },
  handleDomainNameKeyUp: function(event) {
    app.viewUpdatedDomainName(event.target.value)
  },
  handleUsernameKeyUp: function(event) {
    app.viewUpdatedUsername(event.target.value)
  },
  render: function() {
    var viewModel = this.props.viewModel;

    return <div>
      <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" onKeyUp={this.handleUsernameKeyUp} defaultValue={viewModel.username}></input>
      </div>
      <div>
          <label htmlFor="master_password">Password</label>
          <input id="master_password" type="password" onKeyUp={this.handleMasterPasswordKeyUp}></input>
      </div>
      <div>
          <label htmlFor="domain_name">Domain/App name</label>
          <input id="domain_name"></input>
      </div>
      <div>
        <label htmlFor="generated_password">Generated password</label>
        <input id="generated_password" value={viewModel.generatedPasswordValue} readOnly></input>
      </div>
    </div>
  }
})


facade.render = function(viewModel) {
  React.render(
    <MainView viewModel={viewModel} />,
    document.getElementById('mainViewRenderTarget')
  );
  var selectizeInstance = $('#domain_name')[0] && $('#domain_name')[0].selectize;
  if(!selectizeInstance) {
    $('#domain_name').selectize({
      maxItems: 1,
      onItemAdd: app.viewUpdatedDomainName,
      persist: true,
      create: function(value) { return { text: value, value: value } }
    })
  }
  var selectizeInstance = $('#domain_name')[0] && $('#domain_name')[0].selectize;
  selectizeInstance.settings.load = app.viewQueriedDomains;
}

facade.remoteServiceCommand = function(data, callback) {
  if (!data.command) throw new Error('Invalid command');
  $.ajax({
    url: 'http://localhost:5000/command',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    error: function(error) { callback(error, null) },
    success: function(result) { callback(null, result) }
  })
}

var app = App({}, facade)
app.init();
