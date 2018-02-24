import React from 'react'

import { Modal, Button } from 'antd';

class Gambler extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			joined: false,
			gameResultVisible: false
		}
		this.joinGame = this.joinGame.bind(this)
		this.quitGame = this.quitGame.bind(this)
		this.withDrawBalance = this.withDrawBalance.bind(this)
	}

	componentDidMount(){
		const {gamble} = this.props
		// After mount, check is user in game
		this.checkInGame(this.props.account)

		this.gameEndResultEvent = gamble.GameEndResult(this.GameEndResultCallBack.bind(this))
	}
	componentWillUnmount() {
		
		this.gameEndResultEvent.stopWatching()
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
		const { setAlert,gamble, account, web3 } = this.props
		gamble.joinGame({
			from: account,
			value: web3.toWei(1)
		}).then((result) => {
			console.log("Game joined")
			this.setState({
				joined:true
			})
			setAlert(
				"success",
				"Join Game Success",
				"You have joined game!"
			)
		}).catch((error) => {
			console.log("joinGame error!")
			console.log("error")
			setAlert(
				"error",
				"Join Game Error",
				"Join game failed! Check metamask and console for error message!"
			)
		})
	}

	quitGame(){
		// Quit game
		const { setAlert,gamble, account } = this.props
		gamble.quitGame({
			from:account
		}).then((result) => {
			console.log("Game quitted")
			this.setState({
				joined:false
			})
			setAlert(
				"success",
				"Quit Game Success",
				"You have quitted game!"
			)
		}).catch((error) => {
			console.log("quitGame error")
			console.log(error)
			setAlert(
				"error",
				"Quit Game Error",
				"quit game failed! Check metamask and console for error message!"
			)
		})
	}

	withDrawBalance(){
		// Withdraw balance
		const { setAlert,gamble, account } = this.props
		gamble.withdraw({
			from:account
		}).then((result) => {
			console.log("balance withdrawed!")
			setAlert(
				"success",
				"Withdraw Success",
				"You have withdrawed eth!"
			)
		}).catch((error) => {
			console.log("withdraw error")
			console.log(error)
			setAlert(
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

	GameEndResultCallBack(error, result){
		const {account,web3} = this.props

		if (error){
			console.log("GameEndResult Event error")
			console.log(error)
			this.setAlert(
				"error",
				"GameEndResult Event Error",
				"GameEndResult Event failed! Check metamask and console for error message!"
			)
		}else{
			if(result.args.to == account){
				const diff = web3.fromWei(result.args.amount.toNumber())
				const msg =  diff <= 0  ? 
				"Game Ended. You won " + diff + " eth.": 
				"Game Ended. You lost " + (-diff) + " eth."

				console.log(msg);
				Modal.info({
				title: 'Game End Result',
				content: msg,
				onOk() {}
				});
			}
		}
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