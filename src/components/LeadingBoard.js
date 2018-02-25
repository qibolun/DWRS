import React from 'react'
import { List } from 'antd'

class LeadingBoard extends React.Component{

	render(){
		const Item = List.Item
		return(
			<div>
				<List>
					{
						this.props.data.map((v)=>(
							<Item key={v}> {v} </Item>
						))
					}
				</List>
				
			</div>
		)
	}
}

export default LeadingBoard;