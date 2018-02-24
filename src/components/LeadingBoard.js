import React from 'react'

import { List } from 'antd'

class LeadingBoard extends React.Component{

	render(){
		return(
			<div>
				{this.props.data.map((v) => (
					<div key={v}>
						{v}
					</div>
				))}
			</div>
		)
	}
}

export default LeadingBoard;