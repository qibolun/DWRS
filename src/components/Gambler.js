import React from 'react'

import { Button } from 'antd'

class Gambler extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			joined: false
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

	joinGame(){
		// Join game, pay 1 ether at a time
		// FIXME, and a box that allows you to pay arbitary number of ether at a time
		const { gamble, account, web3 } = this.props
		gamble.joinGame({
			from: account,
			value: web3.toWei(1)
		}).then((result) => {
			console.log("Game joined")
			console.log(result)
			this.setState({
				joined:true
			})
		}).catch(() => {
			console.log("joinGame error!")
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
		}).catch((error) => {
			console.log("quitGame error")
			console.log(error)
		})
	}

	withDrawBalance(){
		// Withdraw balance
		const { gamble, account } = this.props
		gamble.withdraw({
			from:account
		}).then((result) => {
			console.log("balance withdrawed!")
		}).catch((error) => {
			console.log("withdraw error")
			console.log(error)
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
		return(
			<div>
				Game joined : {this.state.joined.toString()}
				<Button disabled={this.state.joined} onClick={this.joinGame}>Join Game</Button>
				<Button disabled={!this.state.joined} onClick={this.quitGame}>Quit Game</Button>
				<Button disabled={this.state.joined} onClick={this.withDrawBalance}> WithDraw Balance</Button>
			</div>
		)
	}
}

export default Gambler