import React from 'react'
import { Button,Modal } from 'antd'
class Owner extends React.Component{
	constructor(props){
		super(props)
	}


	componentDidMount(){
		const { gamble, account, web3 } = this.props
		this.OwnerReceivedTips = gamble.OwnerReceivedTips()
		this.OwnerReceivedTips.watch((error, result) => {
			if(!error){
				console.log(result)
				console.log("got tip from other")
				Modal.info({
					title: 'You have received tips!',
					content: "You have received " + web3.fromWei(result.args.num.toNumber()) + " eth from " + result.args.from ,
					onOk() {}
				});
			}else{
				console.log(error)
			}
		})
		
	}

	componentWillUnmount(){
		this.OwnerReceivedTips.stopWatching()
	}

	startGame(){
		const { gamble,setAlert,account,loading,unloading } = this.props
		loading()
		gamble.startGame({
			from:account
		}).then(() => {

		}).catch((error) => {
			console.log("startGame error")
			console.log(error)
			unloading()
			setAlert(
				"error",
				"Start Game Error",
				"Start Game failed! Check metamask and console for error message!"
			)
		})
	}
	render(){

		const style = {
			marginTop: '100px',
			backgroundColor: '#52c41a',
			borderColor: '#52c41a',
			height: '100px',
			width: '150px'
		}
		return(
			<div>
				<Button style={style} type="primary" icon="play-circle" onClick={this.startGame.bind(this)}>
          			Start Game
        		</Button>
			</div>
		)
	}
}

export default Owner