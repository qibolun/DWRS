import React, { Component } from 'react'
import GambleContract from '../build/contracts/Gamble.json'
import getWeb3 from './utils/getWeb3'

import Common from './components/Common'
import {Spin} from 'antd'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import 'antd/dist/antd.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const Gamble = contract(GambleContract)
    Gamble.setProvider(this.state.web3.currentProvider)

    // Get Accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      // Set current account in metamask to the state
      this.setState({
        account:accounts[0]
      })
      // deployed(): Create an instance of Gamble that represents the default address managed by Gamble.
      Gamble.deployed().then((instance) => {
        this.setState({
          gamble: instance
        })
      })
    })
  }




  render() {

    const { account, gamble, web3 } = this.state
    return (
      <div className="App">
        
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">DWRS - Decentralized Wealth Re-distribution System</a>
        </nav>

        {gamble ? (
          <Common account={account} gamble={gamble} web3={web3}></Common>
        ) : (
          <Spin tip="Loading..." />
        )}



        
      </div>
    );
  }
}

export default App
