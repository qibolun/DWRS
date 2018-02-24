import React from 'react'

import { InputNumber,Modal,Button} from 'antd'

class Gambler extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			joined: false,
			gameResultVisible: false,
			eth:0,
			amountModalVisible: false,
		}
		this.joinGame = this.joinGame.bind(this)
		this.quitGame = this.quitGame.bind(this)
		this.withDrawBalance = this.withDrawBalance.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.tipOwner = this.tipOwner.bind(this)

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


  	handleChange(value){
  		this.setState({
  			eth: value
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
				"Join game failed! Check metamask and console for error message!"
			)
		})

		this.onAmountModalCancel();
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
				"quit game failed! Check metamask and console for error message!"
			)
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
				"withdraw failed! Check metamask and console for error message!"
			)
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
				"tip owner failed! Check metamask and console for error message!"
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
		const {account, web3, unloading} = this.props
		unloading()
		if (error){
			console.log("GameEndResult Event error")
			console.log(error)
			this.setAlert(
				"error",
				"GameEndResult Event Error",
				"GameEndResult Event failed! Check metamask and console for error message!"
			)
		}else{
			if(result.args.to === account){
				const diff = web3.fromWei(result.args.amount.toNumber()) - 1
				const msg =  diff >= 0  ? 
				"Game Ended. You won " + diff + " eth.": 
				"Game Ended. You lost " + (-diff) + " eth."

				console.log(msg);
				Modal.info({
					title: 'Game End Result',
					content: msg,
					onOk() {}
				});
				this.setState({
					joined:false
				})
			}
		}
	}

	RenderButtons(props){

		const style={
			margin: '10px'
		}
		if(this.state.joined){
			return <Button style={style} type="danger" icon="user-delete" size='large' onClick={this.quitGame}>Unready</Button>
		}else{
			return (
				<div>
			<Button style={style} type="primary" icon="user-add" size='large' onClick={this.showAmountModal.bind(this)}> Ready </Button>
			<br/>
			<Button style={style} type="primary" icon="user-add" size='default' onClick={this.withDrawBalance}> WithDraw Balance</Button>
			</div>
			)
		}
	}

	onAmountModalCancel(){
		this.props.unloading()
		this.setState({
	      amountModalVisible: false,
	    });
	}

	  showAmountModal() {
	    this.setState({
	      amountModalVisible: true,
	    });
	  }

	render(){
		
		return(
			<div>

				{this.RenderButtons()}
				
				<br/>

				<Modal
			        visible={this.state.amountModalVisible}
			        title="Choose bet amount!"
			        okText="Confirm"
			        onCancel={this.onAmountModalCancel.bind(this)}
			        onOk={this.joinGame}
			    >
			        <InputNumber defaultValue={0} min={0} max={10} step={0.1} formatter={value => `${value} ETH`} onChange={this.handleChange.bind(this)} />
			    </Modal>

			</div>
		)
	}
}

export default Gambler