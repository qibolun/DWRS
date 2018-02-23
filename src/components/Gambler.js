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

	render(){
		return(
			<div>
				This is gambler Component
				<Button disabled={this.state.joined} onClick={this.joinGame}>Join Game</Button>
				<Button disabled={!this.state.joined} onClick={this.quitGame}>Quit Game</Button>
			</div>
		)
	}
}

export default Gambler