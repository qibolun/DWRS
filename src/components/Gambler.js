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
	}

	componentDidMount(){
		this.checkInGame(this.props.account)
	}

	componentWillReceiveProps(nextProps){
		if(this.props.account !== nextProps.account){
			this.checkInGame(nextProps.account)
		}
  	}

	joinGame(){
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
		const { gamble, account } = this.props
		gamble.quitGame({
			from:account
		}).then((result) => {
			console.log("Game quitted")
			console.log(result)
			this.setState({
				joined:false
			})
		}).catch((error) => {
			console.log("quitGame error")
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
			</div>
		)
	}
}

export default Gambler