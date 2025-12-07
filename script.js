// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');

// Counters
const allCount = document.getElementById('allCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

// State
let todos = [];
let currentFilter = 'all';

// Load todos from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadTodosFromStorage();
    renderTodos();
    updateCounts();
});

// Add todo on button click
addBtn.addEventListener('click', addTodo);

// Add todo on Enter key
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Set current filter
        currentFilter = btn.dataset.filter;
        // Render todos with new filter
        renderTodos();
    });
});

// Clear completed todos
clearCompletedBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all completed todos?')) {
        todos = todos.filter(todo => !todo.completed);
        saveTodosToStorage();
        renderTodos();
        updateCounts();
    }
});

// Add new todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('Please enter a todo!');
        return;
    }
    
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.unshift(newTodo); // Add to beginning of array
    todoInput.value = ''; // Clear input
    todoInput.focus(); // Focus back on input
    
    saveTodosToStorage();
    renderTodos();
    updateCounts();
}

// Toggle todo completion
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodosToStorage();
    renderTodos();
    updateCounts();
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    
    saveTodosToStorage();
    renderTodos();
    updateCounts();
}

// Render todos based on current filter
function renderTodos() {
    // Filter todos based on current filter
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // Clear list
    todoList.innerHTML = '';
    
    // Show empty state if no todos
    if (filteredTodos.length === 0) {
        emptyState.classList.add('show');
        return;
    } else {
        emptyState.classList.remove('show');
    }
    
    // Create todo items
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="todo-checkbox" onclick="toggleTodo(${todo.id})">
                <i class="fas fa-check"></i>
            </div>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        todoList.appendChild(li);
    });
}

// Update counters
function updateCounts() {
    const total = todos.length;
    const active = todos.filter(todo => !todo.completed).length;
    const completed = todos.filter(todo => todo.completed).length;
    
    allCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
    
    // Enable/disable clear completed button
    clearCompletedBtn.disabled = completed === 0;
}

// Save todos to localStorage
function saveTodosToStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodosFromStorage() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        todos = JSON.parse(stored);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initial render
console.log('Todo List App initialized! 🚀');