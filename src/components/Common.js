import React from 'react'
import readySVG from '../img/ready.svg';
import empty from '../img/empty.svg';

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
		const { gamble, unloading } = this.props
		// Start Watch UpdateGamerNum event
		this.UpdateGamerNum = gamble.UpdateGamerNum()
		this.UpdateGamerNum.watch(function(error, result){
			console.log("update gamer num event triggered")
			unloading()
			if(!error){
				this.setState({
					currentGameGamblers:result.args.num.toNumber()
				})
			}else{
				console.log(error);
			}
		}.bind(this))

		this.UpdateGamerBalance = gamble.UpdateGamerBalance()
		this.UpdateGamerBalance.watch(function(error, result){
			console.log("update gamer balance event triggered")
			if (result.args.to !== this.props.account){
				return
			}
			unloading()
			if(!error){
				this.setState({
					balance:result.args.num.toNumber()
				})
			}else{
				console.log(error);
			}
		}.bind(this))

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
		const style = {
			filter: 'invert(100%)'
		}
		const center = {
			display:"block",
			marginLeft: "auto",
			marginRight: "auto",
			width: '40%'
		}
		return(
			<div>
			<div style={center}>
			{
				Array.apply(null, Array(this.state.currentGameGamblers)).map((x,i)=>
					<img style={style} alt="" src={readySVG} width='100' height='100' key={i} />
				)
				
			}
			{
				Array.apply(null, Array(2-this.state.currentGameGamblers)).map((x,i)=>
					<img style={style} src={empty} width='100' height='100' key={i} />
				)
			}
			</div>
			<br/>
				{this.state.currentGameGamblers}/2
				<br/>
				Current Balance: {web3.fromWei(this.state.balance)} ether
				<br/>
			</div>
		)
	}

}

export default Common