// Backend base URL
const BASE_URL = 'http://localhost:5555/api';

let token = null;//
let editingTodoId = null;//

// ---------- Auth ----------
async function signUp() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if(res.ok){
        token = data.token;
        showTodoSection();
        getTodos();
    } else {
        alert(data.message);
    }
}

async function logIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if(res.ok){
        token = data.token;
        showTodoSection();
        getTodos();
    } else {
        alert(data.message);
    }
}

function logOut() {
    token = null;
    document.getElementById('todo-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
}

// ---------- ToDo ----------
function showTodoSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('todo-section').style.display = 'block';
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-desc').value = '';
    editingTodoId = null;
}

async function createTodo() {
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-desc').value;

    if(editingTodoId){
        // Update existing ToDo
        const res = await fetch(`${BASE_URL}/todos/update/${editingTodoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });
        const data = await res.json();
        if(res.ok){ editingTodoId = null; getTodos(); }
        else alert(data.message);
    } else {
        // Create new ToDo
        const res = await fetch(`${BASE_URL}/todos/create`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });
        const data = await res.json();
        if(res.ok){
            getTodos();
        } else alert(data.message);
    }

    document.getElementById('todo-title').value = '';
    document.getElementById('todo-desc').value = '';
}

async function getTodos() {
    const res = await fetch(`${BASE_URL}/todos/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if(res.ok){
        const list = document.getElementById('todo-list');
        list.innerHTML = '';

        data.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-card';

            const details = document.createElement('div');
            details.className = 'todo-details';
            details.innerHTML = `<b>${todo.title}</b><br>${todo.description}`;

            const actions = document.createElement('div');

            // Status button
            const statusBtn = document.createElement('button');
            statusBtn.className = `status-btn status-${todo.status.replace(' ','')}`;
            statusBtn.textContent = todo.status;
            statusBtn.onclick = () => changeStatus(todo);

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'primary';
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => {
                document.getElementById('todo-title').value = todo.title;
                document.getElementById('todo-desc').value = todo.description;
                editingTodoId = todo._id;
            };

            // Delete button
            const delBtn = document.createElement('button');
            delBtn.className = 'secondary';
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => deleteTodo(todo._id);

            actions.appendChild(statusBtn);
            actions.appendChild(editBtn);
            actions.appendChild(delBtn);

            li.appendChild(details);
            li.appendChild(actions);
            list.appendChild(li);
        });
    } else alert(data.message);
}

async function deleteTodo(id) {
    const res = await fetch(`${BASE_URL}/todos/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if(res.ok) getTodos();
    else {
        const data = await res.json();
        alert(data.message);
    }
}

async function changeStatus(todo) {
    let nextStatus;
    if(todo.status === 'pending') nextStatus = 'in-progress';
    else if(todo.status === 'in-progress') nextStatus = 'completed';
    else nextStatus = 'pending';

    const res = await fetch(`${BASE_URL}/todos/update/${todo._id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
    });

    if(res.ok) getTodos();
    else {
        const data = await res.json();
        alert(data.message);
    }
}
