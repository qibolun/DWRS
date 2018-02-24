import React, { Component } from 'react'
import GambleContract from '../build/contracts/Gamble.json'
import getWeb3 from './utils/getWeb3'
import Parallax from 'parallax-js'

import Common from './components/Common'
import Gambler from './components/Gambler'
import Owner from './components/Owner'

import { Spin ,Alert, Col, Row} from 'antd'

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
      web3: null,
      alert:{
        type:"",
        msg:"",
        desc:""
      },
      dispAlert:false,
      loading:false
    }

    this.onClose = this.onClose.bind(this)
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

        instance.owner().then((result) => {
          this.setState({
            owner: result
          })
        }).catch((error) => {
          console.log(error)
        })
      })
    })
  }

  onClose(event){
    this.setState({
      dispAlert:false
    })
  }

  componentDidMount(){
    // Do a polling to detect the account change
    this.timer = setInterval(()=> this.watchAccount(), 1000);
    this.parallax = new Parallax(this.scene)
  }

  componentWillUnmount() {
    this.timer = null;
    this.parallax.disable()
  }

  loading(){
    this.setState({
      loading:true
    })
  }

  unloading(){
    this.setState({
      loading:false
    })
  }


  watchAccount(){
    // console.log(this.state.web3.eth.accounts)
    if(this.state.web3 && this.state.account){
      if (this.state.web3.eth.accounts[0] !== this.state.account){
        //Update state when account change
        console.log("detect account change")
        this.setState({
          account:this.state.web3.eth.accounts[0],
          dispAlert:false
        })
      }
    }
  }

  setAlert(type, msg, desc){
    this.setState({
      alert:{type, msg, desc},
      dispAlert:true
    })
  }

  render() {
    const {dispAlert, alert, account, gamble, web3, owner } = this.state
    const pStyle = {
      transform: "translate3d(0px, 0px, 0px)"
    };
    const gambleStyle = {
        position: "absolute",
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '30px',
        height: '600px',
        marginTop: '50px',
        width: '700px',
        color:'white',
        textAlign:'center'
    }
    // Display owner component when owner account gets selected in metamask
    return (
      <div className="App" >
        
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">DWRS - Decentralized Wealth Re-distribution System</a>
        </nav>

        <Row>
        <Col span={12} offset={6}>
        <div style={gambleStyle}>
        {dispAlert? (
          <Alert message={alert.msg} description={alert.desc} type={alert.type} showIcon closable onClose={this.onClose}/>
        ) : (<div />)
        }

        {gamble ? (
          <div>
            <Spin spinning={this.state.loading}>
              <Common 
                setAlert={this.setAlert.bind(this)}
                account={account} 
                gamble={gamble} 
                web3={web3} 
                loading={this.loading.bind(this)}
                unloading={this.unloading.bind(this)} />
              <Gambler 
                setAlert={this.setAlert.bind(this)}
                account={account} 
                gamble={gamble} 
                web3={web3}
                loading={this.loading.bind(this)}
                unloading={this.unloading.bind(this)} />
                <hr/>
              {owner === account ? (
                <Owner 
                  setAlert={this.setAlert.bind(this)} 
                  account={account} 
                  gamble={gamble} 
                  web3={web3}
                  loading={this.loading.bind(this)}
                  unloading={this.unloading.bind(this)} />
              ) : (<div />)
              }
            </Spin>
          </div>
        ) : (
          <Spin tip="Loading..." />
        )}

        </div>
      </Col>
      </Row>
        <div id="page">
            <div id="ParallaxWrapper">
                <div id="ContainerParallax" className="container">
                    <ul ref={el => this.scene = el} className="scene framed" >
                        <li id="scene1" className="layer layer1" data-depth="0.5" data-relativeinput="true" data-cliprelativeinput="true" data-limit-y="10" data-limit-x="10" data-invert-x="true" data-invert-y="true" data-friction-x="0.3" data-friction-y="0.3" data-origin-x="{param_originX}" data-origin-y="{param_originY}" style={pStyle}></li>
                        <li id="scene2" className="layer layer2" data-depth="0.1" data-relativeinput="true" data-cliprelativeinput="true" data-limit-y="10" data-limit-x="10" data-invert-x="true" data-invert-y="true" data-friction-x="0.3" data-friction-y="0.3" data-origin-x="{param_originX}" data-origin-y="{param_originY}" style={pStyle}></li>
                        <li id="scene3" className="layer layer3" data-depth="0.3" data-relativeinput="true" data-cliprelativeinput="true" data-limit-y="10" data-limit-x="10" data-invert-x="true" data-invert-y="true" data-friction-x="0.3" data-friction-y="0.3" data-origin-x="{param_originX}" data-origin-y="{param_originY}" style={pStyle}></li>
                        
                    </ul>
                </div>
            </div>
        </div>



      </div>
    );
  }
}

export default App
