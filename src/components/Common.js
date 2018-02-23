import React from 'react'
import { Button } from 'antd'

class Common extends React.Component{

	// This is the component to keep tract current number of gamer
	// Possibly extend to broadcast the result of each game
	constructor(props) {
		super(props);
		this.state = {
			currentGameGamblers:0,
			balance:0
		}
		this.getCurrentGamer = this.getCurrentGamer.bind(this)
	}

	componentDidMount(){
		const { gamble } = this.props

		console.log("component did mount")

		// Start Watch UpdateGamerNum event
		this.UpdateGamerNum = gamble.UpdateGamerNum()
		this.UpdateGamerNum.watch(function(error, result){
			console.log("event triggered")
			if(!error){
				this.setState({
					currentGameGamblers:result.args.num
				})
			}else{
				console.log(error);
			}
		})

		// Read current balance
		this.readBalance(this.props.account)
	}

	componentWillReceiveProps(nextProps){
		if(this.props.account !== nextProps.account){
			this.readBalance(nextProps.account)
		}
  	}

	componentWillUnmount() {
		this.UpdateGamerNum.stopWatching()
	}

	readBalance(account) {
		const { gamble } = this.props
		gamble.checkGamblerBalance(account, {
			from:account,
		}).then((result) => {
			this.setState({
				balance:result.toNumber()
			})
		}).catch(() => {
			console.log("gambler does not exist in record")
			this.setState({
				balance:0
			})
		})
	}

	getCurrentGamer(){
		const { gamble, account } = this.props
		gamble.getNumberOfGamer({
			from:account
		}).then((result) => {
			console.log(result.toNumber())
		}).catch((error) => {
			console.log("Error when getting current number of gamer", error)
		})

	}


	render(){
		const { web3 } = this.props
		return(
			<div>
				Current Gamer: {this.state.currentGameGamblers}/2
				Current Balance: {web3.fromWei(this.state.balance)} ether
				<Button onClick={this.getCurrentGamer}> Get Num Gamer</Button>
			</div>
		)
	}

}

export default Common