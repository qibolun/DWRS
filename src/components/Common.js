import React from 'react'

class Common extends React.Component{

	// This is the component to keep tract current number of gamer
	// Possibly extend to broadcast the result of each game
	constructor(props) {
		super(props);
		this.state = {
			currentGameGamblers:0
		}
	}

	componentDidMount(){
		const { gamble, web3 } = this.props;

		// Start Watch UpdateGamerNum event
		this.UpdateGamerNum = gamble.UpdateGamerNum()
		this.UpdateGamerNum.watch(function(error, result){
			console.log(result)
			if(!error){
				this.setState({
					currentGameGamblers:result.args.num
				})
			}else{
				console.log(error);
			}
		})
	}


	componentWillUnmount() {
		this.UpdateGamerNum.stopWatching()
	}


	render(){
		return(
			<div>
				Current Gamer: {this.state.currentGameGamblers}/2
			</div>
		)
	}

}

export default Common