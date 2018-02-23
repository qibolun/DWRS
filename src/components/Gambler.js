import React from 'react'

import { Button, Alert } from 'antd'

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
			dispAlert:false
		}
		this.joinGame = this.joinGame.bind(this)
		this.quitGame = this.quitGame.bind(this)
		this.withDrawBalance = this.withDrawBalance.bind(this)
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

  		//kill the message after 1.5 sec

  		setTimeout(function(){this.setState({dispAlert:false})}.bind(this), 1500);
  	}

	joinGame(){
		// Join game, pay 1 ether at a time
		// FIXME, and a box that allows you to pay arbitary number of ether at a time
		const { gamble, account, web3 } = this.props
		gamble.joinGame({
			from: account,
			value: web3.toWei(1)
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
			this.setAlert(
				"error",
				"Join Game Error",
				"Join game failed! Check metamask and console for error message!"
			)
		})
	}

	quitGame(){
		// Quit game
		const { gamble, account } = this.props
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
		const { gamble, account } = this.props
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
				<Button disabled={this.state.joined} onClick={this.joinGame}>Join Game</Button>
				<Button disabled={!this.state.joined} onClick={this.quitGame}>Quit Game</Button>
				<Button disabled={this.state.joined} onClick={this.withDrawBalance}> WithDraw Balance</Button>
				{dispAlert? (
					<Alert message={alert.msg} description={alert.desc} type={alert.type} showIcon />
				) : (<div />)
				}
			</div>
		)
	}
}

export default Gambler