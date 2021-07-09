import React, { useState, useEffect } from 'react';
import './App.css';
import './firebase/firebase';
import Todo from './components/Todo';
import { database } from './firebase/firebase';
import firebase from 'firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { lineThroughText, fetchData } from './firebase/functions';
import Loading from './components/Loading';

//firebase.firestore.FieldValue.serverTimestamp(),
function App() {
	const [input, setInput] = useState('');
	const [id, setId] = useState(null);
	const [editInput, setEditInput] = useState('');
	const [todoInEdit, setTodoInEdit] = useState('');
	const [isEmpty, setIsEmpty] = useState(true);
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const apiCall = () => {
		(async () => {
			const data = await fetchData();
			if (data.length > 0) setIsEmpty(false);
			setTodos(data);
			setIsLoading(false);
		})();
	};
	useEffect(() => {
		setIsLoading(true);
		apiCall();
	}, []);

	const addTodoHandler = (e) => {
		e.preventDefault();
		database
			.collection('todos')
			.add({
				task: input,
				complete: false,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			})
			.then((data) => {
				const added = {
					id: data.id,
					task: input,
					complete: false,
				};
				setTodos([...todos, added]);

				setInput('');
			})
			.catch((error) => console.log(error));
	};

	const markTodo = (todo) => {
		database
			.collection('todos')
			.doc(todo.id)
			.set({
				...todo,
				complete: !todo.complete,
				//timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			})
			.then(() => {
				lineThroughText(todo.id, todo);
			})
			.catch((error) => console.log(error));
	};

	const handleDelete = async (e, todo) => {
		e.preventDefault();
		await database.collection('todos').doc(todo.id).delete();
		const filtered = todos.filter((t) => {
			return t.id !== todo.id;
		});
		setTodos(filtered);
	};

	const handleEdit = (e, todo, todoID, todos) => {
		let inputInEdit = document.getElementById('input' + todo.id);

		e.preventDefault();
		setId(todoID);
		setEditInput(inputInEdit);
		setTodoInEdit(todo);

		inputInEdit.disabled = false;

		for (let i = 0; i < todos.length; i++) {
			if (todos[i].id !== todo.id) {
				document.getElementById('button' + todos[i].id).disabled = true;
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
				//timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			})
			.then(() => {
				for (let i = 0; i < todos.length; i++) {
					document.getElementById('button' + todos[i].id).disabled = false;
				}
				editInput.disabled = true;
				document.getElementById('savebtn').style = 'display:none;';
			})
			.catch((error) => console.log(error));
	};

	return (
		<div className='app container'>
			{isLoading && <Loading />}
			<h1>
				TODO <span className='span-app'>APP</span>
			</h1>
			<form className='add-todo-form'>
				{isEmpty && (
					<p className='alert alert-warning'>
						There are no todos in your task Manager
					</p>
				)}
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
