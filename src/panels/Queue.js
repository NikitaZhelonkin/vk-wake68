import React from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, PanelHeaderButton, Group, Header, List, Cell, FixedLayout, Div, Button, CellButton, Avatar, Input, FormItem } from '@vkontakte/vkui';

import Icon24Add from '@vkontakte/icons/dist/24/add';





const Queue = props => (
	<Panel id={props.id}>
		<PanelHeader

		>Wake 68
		</PanelHeader>


		<Group header={<Header mode="secondary" >Сейчас катается</Header>}>
			{
			riding(props).map((item)=>(
				<Cell
							before={<Avatar shadow={false} size={40}>{item.name[0].toUpperCase()}</Avatar>}
							multiline
							expandable
							removable={false}
							key={item.order}
							indicator={calculateTimeLeft(item.startRidingTime)}
							onClick={(e) => props.participantMenu(e, item)}
						>
							{item.name } 
							
						</Cell>
			))
			}
		</Group>

		<Group header={<Header mode="secondary" indicator={queue(props).length} >Очередь</Header>}>

			<List>
				{
					queue(props).map((item) =>
					(
						<Cell
							before={<Avatar shadow={false} size={40}>{item.name[0].toUpperCase()}</Avatar>}
							multiline
							expandable
							removable={false}
							key={item.order}
							onClick={(e) => props.participantMenu(e, item)}
						// removable onRemove={() => {
						// 	props.removeParticipant(item.order)
						//   }}

						>
							{item.name}
							
						</Cell>
					))
				}
				<CellButton before={<Avatar shadow={false} size={40}><Icon24Add /></Avatar>}
					onClick={() => props.addParticipant()}>
					Добавить участника
				</CellButton>
			</List>


		</Group>



	</Panel>
);

function queue(props) {
	return props.queue.data.filter((item)=>item.riding!=true)
}

function riding(props) {
	return props.queue.data.filter((item)=>item.riding==true)
}

function calculateTimeLeft(since) {
	let difference = new Date().getTime()-since;
	let minutes = Math.floor((difference / 1000 / 60) % 60)
	let seconds = Math.floor((difference / 1000) % 60)
	if (minutes   < 10) {minutes   = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
	return  minutes+":"+seconds
}

Queue.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Queue;