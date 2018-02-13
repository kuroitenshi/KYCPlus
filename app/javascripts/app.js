// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'
import KYCPlus_artifacts from '../../build/contracts/KYCPlus.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);
var KYCPlus = contract(KYCPlus_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);
	KYCPlus.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  },
  
  sendCustomerDetails: function(){
	  
	var self = this;

    var firstName = document.getElementById("firstName").value;
	var middleName = document.getElementById("middleName").value;
	var lastName = document.getElementById("lastName").value;
	
	var kyc;
	
	KYCPlus.deployed().then(function(instance) {
      kyc = instance;
      return kyc.setCustomerDetails(firstName, middleName, lastName, 9, "sample address", {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.getCustomerDetails();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending customer details; see log.");
    });


    this.setStatus("Initiating transaction... (please wait)");
	 
  },
  
  getCustomerDetails: function() {
    var self = this;

    var kyc;
    KYCPlus.deployed().then(function(instance) {
      kyc = instance;
      return kyc.getCustomerDetails();
    }).then(function(value) {
      var custDetails_element = document.getElementById("custDetails");
      custDetails_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      
    });
  },
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    
    window.web3 = new Web3(web3.currentProvider);
  } else {
   
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  }

  App.start();
});
