import React from 'react'

import { Radio } from 'antd'

class Tip extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			tipPercent:"1"
		}
	}

	componentDidMount(){
		const { diff } = this.props
		this.props.setTipAmount(diff*1/100)
	}

	handlePercentChange = (e) => {
		const { diff } = this.props
		const tipPercent = e.target.value
		this.setState({tipPercent: e.target.value})
		this.props.setTipAmount(diff*parseInt(tipPercent, 10)/100)
	}


	render(){
		const { tipPercent } = this.state
		const { diff } = this.props
		return(
			<div>
				{this.props.msg}
				{diff > 0 ? (
					<div>
						<br />
						Tip contract owner with selected percent of your earning!
						<br />
						<Radio.Group value={tipPercent} onChange={this.handlePercentChange}>
				          <Radio.Button value="1">1%</Radio.Button>
				          <Radio.Button value="2">2%</Radio.Button>
				          <Radio.Button value="3">3%</Radio.Button>
				        </Radio.Group>
				         {(diff*parseInt(tipPercent,10)/100).toString()} ether
				    </div>
				): (<div />)}
				
			</div>
		)
	}

}

export default Tip