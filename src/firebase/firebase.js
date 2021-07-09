import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBL9kWEGgkH3LleFIEwhnw76SEg0y-S3bQ',
	authDomain: 'todoapp-ce352.firebaseapp.com',
	projectId: 'todoapp-ce352',
	storageBucket: 'todoapp-ce352.appspot.com',
	messagingSenderId: '246202628231',
	appId: '1:246202628231:web:60843dd4880054dceca022',
	measurementId: 'G-7N7WCKY1FD',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const database = firebaseApp.firestore();
export { database };
//same as
//export default database;
