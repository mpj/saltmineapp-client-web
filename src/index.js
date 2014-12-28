
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
  componentDidMount: function() {
    var username = this.refs.username;
    if (!username.state.initialValue) {
      username.getDOMNode().focus();
    } else {
      this.refs.masterPassword.getDOMNode().focus();
    }
  },
  componentDidUpdate: function() {
    var viewModel = this.props.viewModel;
    if (viewModel.generatedPasswordFocus)
      $(this.refs.generatedPassword.getDOMNode()).focus().select();
  },
  render: function() {
    var viewModel = this.props.viewModel;

    return <div>
      <div>
          <label htmlFor="username">Username</label>
          <input className="form-control" id="username" ref="username" type="text" onKeyUp={this.handleUsernameKeyUp} defaultValue={viewModel.username}></input>
      </div>
      <div>
          <label htmlFor="master_password">Master password</label>
          <input className="form-control" id="master_password" ref="masterPassword" type="password" onKeyUp={this.handleMasterPasswordKeyUp}></input>
      </div>
      <div>
          <label htmlFor="domain_name">Domain/App name</label>
          <input className="form-control" id="domain_name"></input>
      </div>
      <div>
        <label htmlFor="generated_password">Generated password</label>
        <input className="form-control" id="generated_password" ref="generatedPassword" value={viewModel.generatedPasswordValue} readOnly></input>
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
  var backendUriRoot = window.devmode ? 'http://localhost:5000' :
    'https://saltmineapp-server-staging.herokuapp.com';
  $.ajax({
    url: backendUriRoot + '/command',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    error: function(error) { callback(error, null) },
    success: function(result) { callback(null, result) }
  })
}

var app = App({}, facade)
app.init();
