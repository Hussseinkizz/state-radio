'use strict';
import { StateRadio } from './state-radio.js';
const taskInput = document.querySelector('#taskInput');
const addTaskButton = document.querySelector('#addTaskButton');
const filterSelect = document.querySelector('#filterSelect');

addTaskButton.addEventListener('click', () => addTask(taskInput.value));
filterSelect.addEventListener('change', () => setFilter(filterSelect.value));

const { channels } = new StateRadio();

// Add a channel for tasks
const tasksChannel = channels.addChannel('tasks', []);

// Add a channel for visibility filter
const filterChannel = channels.addChannel('filter', 'all');

// Action to add a task
const addTask = (text) => {
  tasksChannel.setState((tasks) => [...tasks, { text, completed: false }]);
};

// Action to toggle task completion
const toggleTask = (index) => {
  tasksChannel.setState((tasks) =>
    tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    )
  );
};

// Action to set visibility filter
const setFilter = (filter) => {
  filterChannel.setState(filter);
};

// Subscribe to tasks changes
tasksChannel.subscribe((tasks) => {
  // Update UI or trigger re-render
  console.log('Tasks Updated:', tasks);
});

// Subscribe to filter changes
filterChannel.subscribe((filter) => {
  // Update UI or trigger re-render based on filter
  console.log('Filter Updated:', filter);
  // Update UI based on filter
  let currentTasks = tasksChannel.getState();
  let filteredTasks = [];

  if (filter === 'completed') {
    filteredTasks = currentTasks.filter((task) => task.completed === true);
    updateTasksUI(filteredTasks);
  } else if (filter === 'active') {
    updateTasksUI(currentTasks);
  } else {
    updateTasksUI(currentTasks);
  }
});

// Update UI based on state changes
function updateTasksUI(tasks) {
  const tasksContainer = document.getElementById('tasksContainer');
  tasksContainer.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} id="${index}">
        <span>${task.text}</span>
      `;
    tasksContainer.appendChild(taskElement);
    // Add onChange event listener to the checkbox
    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => toggleTask(index));
  });
}

// Subscribe to tasks changes
tasksChannel.subscribe(updateTasksUI);

// Initial rendering
updateTasksUI(tasksChannel.getState());
