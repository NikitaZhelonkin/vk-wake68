import firebase from './firebase'

export function queue(store) {
    store.on('@init', () => ({ queue: { loading: true, data: [] } }))

    store.on('queue/save', ({ queue }, { queueToSave }) => {
        queue.data = queueToSave;
        queue.loading = false;
        return { queue: queue }
    })

    store.on('queue/listen', ({ queue }) => {
        const db = firebase.firestore();
        db.collection('queue')
            .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
                console.log(snapshot);
                store.dispatch('queue/api/get')
            })
    })

    store.on('queue/api/get', ({ queue }) => {
        const db = firebase.firestore();
        db.collection('queue').orderBy("order").get().then((snapshot) => {
            const queueToSave = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    name: doc.data().name,
                    order: doc.data().order,
                    riding: doc.data().riding,
                    startRidingTime: doc.data().startRidingTime
                }
            })
            store.dispatch('queue/save', { queueToSave })
        }).catch((error) => {
            console.log("error get queue from firebase:" + error);
        });

    })

    store.on('queue/api/add', ({ queue }, participant) => {
        const db = firebase.firestore();
        db.collection('queue').add({
            name: participant.name,
            order: participant.order,
            riding: false,
        })
    })

    store.on('queue/api/delete', ({ queue }, order) => {
        const db = firebase.firestore();
        console.log(order)
        db.collection('queue').where("order", "==", order).get()
            .then(snapshot => {
                snapshot.docs[0].ref.delete();
            });
    })

    store.on('queue/api/start', ({ queue }, order) => {
        const db = firebase.firestore();
        
        db.collection('queue').where("riding", "==", true).get()
        .then(snapshot => {
            snapshot.docs.forEach((doc)=>{doc.ref.delete()})
        });
        db.collection('queue').where("order", "==", order).get()
            .then(snapshot => {
                const doc = snapshot.docs[0]
                doc.ref.update({
                    name: doc.data().name,
                    order: doc.data().order,
                    riding: true,
                    startRidingTime: new Date().getTime()
                })
            });
    })

}
