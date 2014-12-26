
typeof window !== "undefined" && (window.React = React)

var App = require('./app');
var crypto = require('crypto');


var facade = {}

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
          <input id="username" type="text" onKeyUp={this.handleUsernameKeyUp}></input>
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
      onItemAdd: app.viewUpdatedDomainName
    })
  }
  var selectizeInstance = $('#domain_name')[0] && $('#domain_name')[0].selectize;
  selectizeInstance.settings.load = function(query, callback) {
    if (!query.length || query.length < 3 || !viewModel.username || !viewModel.masterPassword) return callback([]);
    $.ajax({
      url: 'http://localhost:5000/command',
      type: 'POST',
      contentType: "application/json",
      data: JSON.stringify({
        command: 'query-domains',
        query: query,
        username: viewModel.username,
        masterPassword: viewModel.masterPassword
      }),
      error: function(error) {
        console.warn("Command error", error);
      },
      success: function(res) {
        callback(res.map(function(obj) {
          return {
            text: obj.domainName,
            value: obj.domainName
          }
        }))
      }
    });
  };
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

facade.putDomainName = function(domainName, username, masterPassword, callback) {
  facade.remoteServiceCommand({
    command: 'generate-password',
    domainName: domainName,
    username: username,
    masterPassword: masterPassword
  }, callback);
}

var app = App({}, facade)
app.init();
