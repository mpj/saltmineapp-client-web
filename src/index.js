
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
    console.log("React rendering viewModel", viewModel);

    return <div>
      <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" onKeyUp={this.handleUsernameKeyUp}></input>
      </div>
      <div>
          <label htmlFor="master_password">Password</label>
          <input id="master_password" onKeyUp={this.handleMasterPasswordKeyUp}></input>
      </div>
      <div>
          <label htmlFor="domain_name">Domain/App name</label>
          <input id="domain_name"></input>
      </div>
      <div>
          <input id="allow_special_characters" type="checkbox"></input>
          <label htmlFor="allow_special_characters">Allow special characters</label>
      </div>
      <div>
          <input id="max_length" maxLength="2"></input>
          <label htmlFor="max_length">Max length</label>
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
  $('#domain_name').selectize({
      maxItems: 1,
      delimiter: ',',
      persist: false,
    valueField: 'name',
        labelField: 'name',
        searchField: 'name',
      create: function(input) {
        console.log('create entered', input);
        return {
          value: input,
          name: input
        }
      },
      onItemAdd: function(domainName) {
        app.viewUpdatedDomainName(domainName);
      },
      load: function(query, callback) {
        console.log('load entered', query);
        if (!query.length) return callback();
        callback([
          { name: 'facebook.com', value: 'facebook.com' },
          { name: 'paypal.com', value: 'paypal.com' }
        ])
        /*$.ajax({
            url: 'https://api.github.com/legacy/repos/search/' + encodeURIComponent(query),
            type: 'GET',
            error: function() {
                callback();
            },
            success: function(res) {
                callback(res.repositories.slice(0, 10));
            }
        });*/
      }
  });
}

var Firebase = require('firebase');

facade.insertDomainName = function(domainName) {
  var myRootRef = new Firebase('https://saltmineapp.firebaseio.com/mpj/state');
  myRootRef.set({ dn: domainName });
}

facade.hash = function(str) {
  var hash = crypto.createHash('sha1');
  hash.update(str, 'utf8');
  return hash.digest('base64');
}
var app = App({}, facade)
app.init();
