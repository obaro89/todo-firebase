import React, { useState, useEffect } from 'react';
import './App.css';
import './firebase/firebase';
import Todo from './components/Todo';
import { database } from './firebase/firebase';
import firebase from 'firebase/app';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState('');
	const [id, setId] = useState(null);
	const [editInput, setEditInput] = useState(null);
	const [todoInEdit, setTodoInEdit] = useState(null);
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		database
			.collection('todos')
			.orderBy('timestamp', 'desc')
			.onSnapshot((snapshot) => {
				const arr = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
				setTodos(arr);
			});
	}, []);

	useEffect(() => {
		database
			.collection('todos')
			.orderBy('timestamp', 'desc')
			.get()
			.then((data) => {
				if (data.size !== 0) {
					setIsEmpty(false);
				}
				const arr = data.docs.map((doc) => {
					return doc.data();
				});
				setTodos(arr);
			});
	}, []);

	const addTodoHandler = (e) => {
		e.preventDefault();
		database.collection('todos').add({
			task: input,
			complete: false,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});
		setInput('');
		setEditing(!editing);
	};

	const markTodo = (todo) => {
		database
			.collection('todos')
			.doc(todo.id)
			.set({
				...todo,
				complete: !todo.complete,
			});
	};

	const handleDelete = (e, todo) => {
		e.preventDefault();
		database.collection('todos').doc(todo.id).delete();
		document.getElementById('savebtn').style = 'display:none;';
	};
	const handleEdit = (e, index, todo, todoID, todos) => {
		let inputInEdit = document.getElementById('input' + index);
		e.preventDefault();
		setId(todoID);
		setEditInput(inputInEdit);
		setTodoInEdit(todo);

		inputInEdit.disabled = false;
		for (let i = 0; i < todos.length; i++) {
			if (i !== index) {
				document.getElementById('button' + i).disabled = true;
			}
		}
		document.getElementById('savebtn').style = 'display:block;';
	};

	const saveEdit = (e) => {
		e.preventDefault();
		database
			.collection('todos')
			.doc(id)
			.set({
				...todoInEdit,
				task: editInput.value,
			});

		for (let i = 0; i < todos.length; i++) {
			document.getElementById('button' + i).disabled = false;
		}
		editInput.disabled = true;
		document.getElementById('savebtn').style = 'display:none;';
		console.log(id + '' + editInput.value);
	};

	return (
		<div className='app container'>
			<h1>
				TODO <span className='span-app'>APP</span>
			</h1>
			<form className='add-todo-form'>
				<input value={input} onChange={(e) => setInput(e.target.value)} />
				<button
					className='btn btn-primary'
					type='submit'
					disabled={!input}
					onClick={addTodoHandler}
				>
					Add Todo
				</button>
			</form>

			<Todo
				todos={todos}
				markTodo={markTodo}
				handleDelete={handleDelete}
				handleEdit={handleEdit}
				saveEdit={saveEdit}
			/>

			<footer>
				&copy; 2021 <a href='http://www.igbinobaro.com.ng'>Osaretin</a>
			</footer>
		</div>
	);
}

export default App;
