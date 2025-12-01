const form = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const sortBtn = document.getElementById('sort-due');
const darkModeBtn = document.getElementById('dark-mode-toggle');

const API_URL = 'http://localhost:3000/todos';

let todos = [];
let sortAsc = true;

// Toast function
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => container.removeChild(toast), 300);
  }, 4000);
}

// Fetch todos from backend
async function fetchTodos() {
  try {
    const res = await fetch(API_URL);
    todos = await res.json();
    renderTodos();
  } catch (err) {
    console.error('Error fetching todos:', err);
  }
}

// Add new todo
form.addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('todo-title').value.trim();
  const desc = document.getElementById('todo-desc').value.trim();
  const due = document.getElementById('todo-due').value;
  if (!title) return;

  const todo = { title, desc, due: due ? new Date(due).toISOString() : null, completed: false };

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    showToast('Task added successfully!');
    form.reset();
    fetchTodos();
  } catch (err) {
    console.error('Error adding todo:', err);
  }
});

// Render todos
function renderTodos() {
  todoList.innerHTML = '';
  const now = new Date();

  // Apply search and filter
  let displayTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                          (todo.desc && todo.desc.toLowerCase().includes(searchInput.value.toLowerCase()));
    const matchesFilter = filterSelect.value === 'all' ||
                          (filterSelect.value === 'completed' && todo.completed) ||
                          (filterSelect.value === 'pending' && !todo.completed);
    return matchesSearch && matchesFilter;
  });

  // Sort by due date if exists
  displayTodos.sort((a, b) => {
    if (!a.due) return 1;
    if (!b.due) return -1;
    return sortAsc ? new Date(a.due) - new Date(b.due) : new Date(b.due) - new Date(a.due);
  });

  displayTodos.forEach(todo => {
    const li = document.createElement('li');
    if (document.body.classList.contains('dark')) li.classList.add('dark');

    const isOverdue = todo.due && !todo.completed && new Date(todo.due) < now;
    li.className = '';
    if (todo.completed) li.classList.add('completed');
    if (isOverdue) li.classList.add('overdue');

    li.innerHTML = `
      <div class="task-info">
        <strong>${todo.title}</strong><br>
        ${todo.desc ? `<small>${todo.desc}</small><br>` : ''}
        ${todo.due ? `<small>Due: ${new Date(todo.due).toLocaleString()}</small>` : ''}
      </div>
      <div class="task-actions">
        <button class="complete">${todo.completed ? 'Undo' : 'Complete'}</button>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;

    // Complete / Undo
    li.querySelector('.complete').addEventListener('click', async () => {
      try {
        await fetch(`${API_URL}/${todo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...todo, completed: !todo.completed })
        });
        showToast(`Task "${todo.title}" marked ${!todo.completed ? 'complete' : 'incomplete'}!`);
        fetchTodos();
      } catch (err) { console.error(err); }
    });

    // Delete
    li.querySelector('.delete').addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this task?')) {
        try {
          await fetch(`${API_URL}/${todo.id}`, { method: 'DELETE' });
          showToast(`Task "${todo.title}" deleted!`);
          fetchTodos();
        } catch (err) { console.error(err); }
      }
    });

    // Edit
    li.querySelector('.edit').addEventListener('click', async () => {
      const newTitle = prompt('Edit title', todo.title);
      if (newTitle !== null) todo.title = newTitle.trim();
      const newDesc = prompt('Edit description', todo.desc);
      if (newDesc !== null) todo.desc = newDesc.trim();
      const newDue = prompt('Edit due date (YYYY-MM-DDTHH:MM)', todo.due ? new Date(todo.due).toISOString().slice(0,16) : '');
      if (newDue) todo.due = new Date(newDue).toISOString();

      try {
        await fetch(`${API_URL}/${todo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todo)
        });
        showToast(`Task "${todo.title}" updated!`);
        fetchTodos();
      } catch (err) { console.error(err); }
    });

    todoList.appendChild(li);

    // Notification for due task (less than 1 min)
    if (todo.due && !todo.completed) {
      const timeLeft = new Date(todo.due) - now;
      if (timeLeft > 0 && timeLeft < 60000) showToast(`Task "${todo.title}" is due now!`);
    }
  });
}

// Event listeners for search/filter/sort/dark mode
searchInput.addEventListener('input', renderTodos);
filterSelect.addEventListener('change', renderTodos);
sortBtn.addEventListener('click', () => { sortAsc = !sortAsc; renderTodos(); });
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.querySelector('.container').classList.toggle('dark');
  document.querySelectorAll('li').forEach(li => li.classList.toggle('dark'));
});

fetchTodos();
