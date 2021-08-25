import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ModalRoot, ModalCard, Button, FormItem, Input, Group, CellButton, ActionSheet, ActionSheetItem } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import { useStoreon } from 'storeon/react'

import Home from './panels/Home';
import Persik from './panels/Persik';
import Queue from './panels/Queue';

import Icon28Start from '@vkontakte/icons/dist/28/play';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';

const App = () => {
	const { dispatch, queue } = useStoreon('queue')
	const [activePanel, setActivePanel] = useState('queue');
	const [fetchedUser, setUser] = useState(null);
	// const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [popout, setPopout] = useState(null);
	const [activeModal, setActiveModal] = useState(null);
	const [newParticipantName, setNewParticipantName] = useState(null);
	const [time, setTime] = useState(null);


	const newParticipantNameRef = useRef(newParticipantName);

	useEffect(() => {
		newParticipantNameRef.current = newParticipantName;
	}, [newParticipantName])

	useEffect(() => {
		const timer = setTimeout(() => {
			console.log(">>")
		setTime(Date());
		}, 1000);
	  });

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);

		}
		async function subscribeStore() {
			dispatch('queue/listen')
		}
		subscribeStore();
		fetchData();

	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const showParticipantMenu = (e, item) => {
		if(item.riding){
			setPopout(<ActionSheet
				onClose={() => setPopout(null)}
				iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
				toggleRef={e.target}
			>
				<ActionSheetItem  onClick={()=>{doRemoveParticipant(item.order)}} mode="destructive" autoclose before={<Icon28DeleteOutline/>}>
					Удалить участника
				</ActionSheetItem>
			</ActionSheet>)
		}else{
			setPopout(<ActionSheet
				onClose={() => setPopout(null)}
				iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
				toggleRef={e.target}
			>
				<ActionSheetItem onClick={()=>{doStartParticipant(item.order)}} autoclose before={<Icon28Start/>} >
					Катать участника
				</ActionSheetItem>
				<ActionSheetItem  onClick={()=>{doRemoveParticipant(item.order)}} mode="destructive" autoclose before={<Icon28DeleteOutline/>}>
					Удалить участника
				</ActionSheetItem>
			</ActionSheet>)
		}
		
	}

	const onChangeText = (e) => {
		setNewParticipantName(e.target.value.trim())
	}

	const doAddParticipant = (name) => {
		setActiveModal(null)
		var order = queue.data.length==0? 1 : queue.data[queue.data.length-1].order+1 
		dispatch('queue/api/add', { name: name, order: order })
	}

	const doRemoveParticipant = (order) => {
		setActiveModal(null)
		dispatch('queue/api/delete', order)
	}

	const doStartParticipant = (order) => {
		dispatch('queue/api/start', order)
	}

	const addParticipant = id => {
		setActiveModal(<ModalRoot activeModal="modal">
			<ModalCard
				id="modal"
				onClose={() => setActiveModal(null)}
				actions={
					<Button size="l" mode="primary" onClick={() => doAddParticipant(newParticipantNameRef.current)}>
						Добавить
					</Button>
				}
			>
				<FormItem top="Имя участника">
					<Input onChange={onChangeText} />
				</FormItem>

			</ModalCard>
		</ModalRoot>)
	}

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout} modal={activeModal} >
					<Home id='home' fetchedUser={fetchedUser} go={go} />
					<Persik id='persik' go={go} />
					<Queue id="queue" go={go} queue={queue} participantMenu={showParticipantMenu} addParticipant={addParticipant} setPopout={setPopout} time={time} />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
