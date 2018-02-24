import React from 'react'
import {Button} from 'antd'
class Owner extends React.Component{
	constructor(props){
		super(props)
	}


	componentDidMount(){
		//const { gamble } = this.props
		
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
		return(
			<div>
				This is owner component
				<Button type="primary" icon="play-circle" onClick={this.startGame.bind(this)}>
          			Start Game
        		</Button>
			</div>
		)
	}
}

export default Owner