import React from 'react'

import { Button, Alert, Input } from 'antd'

class Gambler extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			joined: false,
			alert:{
				type:"",
				msg:"",
				desc:""
			},
			dispAlert:false,
			eth:0
		}
		this.joinGame = this.joinGame.bind(this)
		this.quitGame = this.quitGame.bind(this)
		this.withDrawBalance = this.withDrawBalance.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.onClose = this.onClose.bind(this)
	}

	componentDidMount(){
		// After mount, check is user in game
		this.checkInGame(this.props.account)
	}

	componentWillReceiveProps(nextProps){
		// If account get changed, re-check if user in game
		if(this.props.account !== nextProps.account){
			this.checkInGame(nextProps.account)
		}
  	}

  	setAlert(type, msg, desc){
  		this.setState({
  			alert:{type, msg, desc},
  			dispAlert:true
  		})
  	}

  	handleChange(event){
  		this.setState({
  			eth: event.target.value
  		})
  	}

  	onClose(event){
  		this.setState({
  			dispAlert:false
  		})
  	}

	joinGame(){
		// Join game, pay 1 ether at a time
		// FIXME, and a box that allows you to pay arbitary number of ether at a time

		const { gamble, account, web3, loading, unloading } = this.props
		const { eth } = this.state
		// start loading animation
		loading()
		gamble.joinGame({
			from: account,
			value: web3.toWei(eth)
		}).then((result) => {
			console.log("Game joined")
			this.setState({
				joined:true
			})
			this.setAlert(
				"success",
				"Join Game Success",
				"You have joined game!"
			)
		}).catch((error) => {
			console.log("joinGame error!")
			console.log("error")
			unloading()
			this.setAlert(
				"error",
				"Join Game Error",
				"Join game failed! Check metamask and console for error message!"
			)
		})
	}

	quitGame(){
		// Quit game
		const { gamble, account, loading, unloading } = this.props
		loading()
		gamble.quitGame({
			from:account
		}).then((result) => {
			console.log("Game quitted")
			this.setState({
				joined:false
			})
			this.setAlert(
				"success",
				"Quit Game Success",
				"You have quitted game!"
			)
		}).catch((error) => {
			unloading()
			console.log("quitGame error")
			console.log(error)
			this.setAlert(
				"error",
				"Quit Game Error",
				"quit game failed! Check metamask and console for error message!"
			)
		})
	}

	withDrawBalance(){
		// Withdraw balance
		const { gamble, account, loading, unloading } = this.props
		loading()
		gamble.withdraw({
			from:account
		}).then((result) => {
			console.log("balance withdrawed!")
			this.setAlert(
				"success",
				"Withdraw Success",
				"You have withdrawed eth!"
			)
		}).catch((error) => {
			unloading()
			console.log("withdraw error")
			console.log(error)
			this.setAlert(
				"error",
				"Withdraw Error",
				"withdraw failed! Check metamask and console for error message!"
			)
		})

	}

	checkInGame(account){
		const { gamble } = this.props
		gamble.checkGamblerInGame(account, {
			from:account,
		}).then((result) => {
			this.setState({
				joined:result
			})
		}).catch(() => {
			console.log("check gambler in game error")
			this.setState({
				joined:false
			})
		})
	}

	render(){
		const { dispAlert, alert } = this.state
		return(
			<div>
				Game joined : {this.state.joined.toString()}
				<Input placeholder="ether" type="number" value={this.state.eth} onChange={this.handleChange} />
				<Button disabled={this.state.joined} onClick={this.joinGame}>Join Game</Button>
				<Button disabled={!this.state.joined} onClick={this.quitGame}>Quit Game</Button>
				<Button disabled={this.state.joined} onClick={this.withDrawBalance}> WithDraw Balance</Button>
				{dispAlert? (
					<Alert message={alert.msg} description={alert.desc} type={alert.type} showIcon closable onClose={this.onClose}/>
				) : (<div />)
				}
			</div>
		)
	}
}

export default Gambler