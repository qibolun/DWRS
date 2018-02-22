import React from 'react'

import { Button } from 'antd'
class Gambler extends React.Component{

	constructor(props) {
		super(props);
		this.state = {}
		this.joinGame = this.joinGame.bind(this)
	}

	joinGame(){
		const { gamble, account, web3 } = this.props
		gamble.joinGame({
			from: account,
			value: web3.toWei(1)
		}).then((result) => {
			console.log(result)
		}).catch(() => {
			console.log("error!")
		})
	}

	render(){
		return(
			<div>
				This is gambler Component
				<Button onClick={this.joinGame}>Join Game</Button>
			</div>
		)
	}
}

export default Gambler