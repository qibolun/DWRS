import React from 'react'


import { Modal, Button, Input, notification } from 'antd'

class Gambler extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			joined: false,
			gameResultVisible: false,
			eth:0
		}
		this.joinGame = this.joinGame.bind(this)
		this.quitGame = this.quitGame.bind(this)
		this.withDrawBalance = this.withDrawBalance.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.tipOwner = this.tipOwner.bind(this)
		this.tipOwnerWhenWinMoney = this.tipOwnerWhenWinMoney.bind(this)
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


  	handleChange(event){
  		this.setState({
  			eth: event.target.value
  		})
  	}



	joinGame(){
		// Join game, pay 1 ether at a time
		// FIXME, and a box that allows you to pay arbitary number of ether at a time

		const { setAlert,gamble, account, web3, loading, unloading } = this.props
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
			setAlert(
				"success",
				"Join Game Success",
				"You have joined game!"
			)
		}).catch((error) => {
			console.log("joinGame error!")
			console.log("error")

			unloading()
			setAlert(
				"error",
				"Join Game Error",
				"Join game failed! Check metamask and notification for error message!"
			)
			notification.open({
				message: 'Error Message',
    			description: error.toString(),
			});
		})
	}

	quitGame(){
		// Quit game

		const { setAlert,gamble, account, loading, unloading } = this.props
		loading()
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
			unloading()
			console.log("quitGame error")
			console.log(error)
			setAlert(
				"error",
				"Quit Game Error",
				"quit game failed! Check metamask and notification for error message!"
			)

			notification.open({
				message: 'Error Message',
    			description: error.toString(),
			});
		})
	}

	withDrawBalance(){
		// Withdraw balance

		const { setAlert, gamble, account, loading, unloading } = this.props
		loading()
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
			unloading()
			console.log("withdraw error")
			console.log(error)
			setAlert(
				"error",
				"Withdraw Error",
				"withdraw failed! Check metamask and notification for error message!"
			)

			notification.open({
				message: 'Error Message',
    			description: error.toString(),
			});
		})

	}

	tipOwner(){
		// tip contract owner
		const { setAlert, gamble, account, web3 } = this.props
		const amount = 0.1 //tip 0.1 eth now
		gamble.tipOwner({
			from: account,
			value: web3.toWei(amount)
		}).then((result) => {
			console.log("tipped owner")
			setAlert(
				"success",
				"Tip Owner Success",
				"You have tipped owner!"
			)
		}).catch((error) => {
			console.log("Tip Owner error!")
			console.log("error")
			setAlert(
				"error",
				"Tip Owner Error",
				"tip owner failed! Check metamask and notification for error message!"
			)

			notification.open({
				message: 'Error Message',
    			description: error.toString(),
			});
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
		const {account, web3, unloading} = this.props
		unloading()
		if (error){
			console.log("GameEndResult Event error")
			console.log(error)
			this.setAlert(
				"error",
				"GameEndResult Event Error",
				"GameEndResult Event failed! Check metamask and notification for error message!"
			)

			notification.open({
				message: 'Error Message',
    			description: error.toString(),
			});


		}else{
			if(result.args.to === account){
				console.log(result.args.amount.toNumber())
				const diff = web3.fromWei(result.args.amount.toNumber()) - 1
				const msg =  diff >= 0  ? 
				"Game Ended. You won " + diff + " eth.": 
				"Game Ended. You lost " + (-diff) + " eth."
				Modal.info({
					title: 'Game End Result',
					content: msg,
					okText:"Ok",
					onOk() {console.log(this)}
				});
				this.setState({
					joined:false
				})
			}
		}
	}


	tipOwnerWhenWinMoney(){
		console.log("tip Owner?????")
	}

	render(){
		
		return(
			<div>
				Game joined : {this.state.joined.toString()}
				<Input placeholder="ether" type="number" value={this.state.eth} onChange={this.handleChange} />
				<Button disabled={this.state.joined} onClick={this.joinGame}>Join Game</Button>
				<Button disabled={!this.state.joined} onClick={this.quitGame}>Quit Game</Button>
				<Button disabled={this.state.joined} onClick={this.withDrawBalance}> WithDraw Balance</Button>
				<Button onClick={this.tipOwner}> Tip Owner</Button>
			</div>
		)
	}
}

export default Gambler