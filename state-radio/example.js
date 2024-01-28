import { StateRadio } from 'state-radio';

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
});

// Example ToDo component
const ToDo = () => {
  // ... component logic

  return (
    <div>
      {/* Render tasks based on state */}
      {tasksChannel.getState().map((task, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(index)}
          />
          <span>{task.text}</span>
        </div>
      ))}

      {/* Filter selection */}
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="active">Active</option>
      </select>
    </div>
  );
};
