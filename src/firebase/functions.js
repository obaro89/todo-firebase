import { database } from './firebase';

export const lineThroughText = (todo) => {
	document.getElementById('checkbox' + todo.id).checked = !todo.complete;
	if (!todo.complete) {
		document.getElementById('input' + todo.id).style =
			'text-decoration: line-through';
	} else {
		document.getElementById('input' + todo.id).style = 'text-decoration: none';
	}
};

export const fetchData = async () => {
	const arr = [];
	const data = await database.collection('todos').get();
	data.forEach((doc) => {
		arr.push({ ...doc.data(), id: doc.id });
	});

	return arr;
};
