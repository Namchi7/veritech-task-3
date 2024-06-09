// Fetch all todos from localStorage and return todo list
function getAllTodos() {
  const todos = JSON.parse(localStorage.getItem("all-todo-list")) || [];

  return todos;
}

// Functions to increase or decrease priority
function priorityInc(id, prevPriority) {
  const priorities = ["low", "mid", "high"];

  const newPriority =
    priorities.indexOf(prevPriority) !== 2
      ? priorities.indexOf(prevPriority) + 1
      : priorities.indexOf(prevPriority);

  saveNewPriority(id, priorities[newPriority]);
}

function priorityDec(id, prevPriority) {
  const priorities = ["low", "mid", "high"];

  const newPriority =
    priorities.indexOf(prevPriority) !== 0
      ? priorities.indexOf(prevPriority) - 1
      : priorities.indexOf(prevPriority);

  saveNewPriority(id, priorities[newPriority]);
}

// Function to save the updated priorities
function saveNewPriority(id, priority) {
  const todos = getAllTodos();

  const newTodos = todos.map((item) => {
    if (item.id === parseInt(id))
      return {
        id: item.id,
        task: item.task,
        priority: priority,
        status: item.status,
      };

    return item;
  });

  saveTodosToLocalStorage(newTodos);
}

// Function to open the edit modal and update the fields with previous values
function editTodo(id) {
  console.log(id);
  const modal = document.getElementById("edit-todo-modal");
  const taskInput = document.getElementById("edit-task");
  const taskId = document.getElementById("edit-task-id");
  const taskStatus = document.getElementById("edit-task-status");
  const priorityInputs = document.getElementsByName("edit-priority");

  const todos = getAllTodos();

  const todo = todos.filter((item) => item.id === id);

  console.log(todo[0].id);

  taskInput.value = todo[0].task;
  taskId.value = todo[0].id;
  taskStatus.value = todo[0].status;
  priorityInputs.forEach((item) => {
    if (item.value === todo[0].priority) {
      item.checked = true;
    }
  });

  modal.style.display = "flex";
}

// Function to save the updated value from edit modal
function saveEditedTodo(e) {
  e.preventDefault();

  const taskInput = document.getElementById("edit-task");
  const taskId = document.getElementById("edit-task-id").value;
  const taskStatus = document.getElementById("edit-task-status").value;
  const priorityInputs = document.getElementsByName("edit-priority");

  let priority = "";

  priorityInputs.forEach((item) => {
    if (item.checked === true) priority = item.value;
  });

  const todos = getAllTodos();

  const newTodos = todos.map((item) => {
    if (item.id === parseInt(taskId))
      return {
        id: item.id,
        task: taskInput.value,
        priority: priority,
        status: taskStatus,
      };

    return item;
  });

  saveTodosToLocalStorage(newTodos);

  closeEditTodoModal(e);
}

// Function to close the edit modal
function closeEditTodoModal(e) {
  e.preventDefault();

  const modal = document.getElementById("edit-todo-modal");

  modal.style.display = "none";
  console.log("Close Modal");
}

// Function to delete a particular todo
function deleteTodo(id) {
  const todos = getAllTodos();

  const newTodos = todos.filter((item) => item.id !== parseInt(id));

  saveTodosToLocalStorage(newTodos);
}

// Function to change hte status of a particular todo to completed
function completeTodo(id) {
  const todos = getAllTodos();

  const newTodos = todos.map((item) => {
    if (item.id === parseInt(id))
      return {
        id: item.id,
        task: item.task,
        priority: item.priority,
        status: "completed",
      };

    return item;
  });

  saveTodosToLocalStorage(newTodos);
}

// Function to open the create todo modal
function openCreateTodoModal(e) {
  e.preventDefault();
  const modal = document.getElementById("create-todo-modal");
  modal.style.display = "flex";
}

// Function to extract values from create todo modal
function createTodo(e) {
  e.preventDefault();

  const taskInput = document.getElementById("task");
  const priorityInputs = document.getElementsByName("priority");

  let priority = "";

  priorityInputs.forEach((item) => {
    if (item.checked === true) priority = item.value;
  });

  const todo = {
    id: Date.now(),
    task: taskInput.value,
    priority: priority,
    status: "pending",
  };

  let allTodos = getAllTodos();

  allTodos = [...allTodos, todo];

  saveTodosToLocalStorage(allTodos);

  taskInput.value = "";

  closeCreateTodoModal(e);
}

// Function to open the create todo modal
function closeCreateTodoModal(e) {
  e.preventDefault();

  const modal = document.getElementById("create-todo-modal");

  modal.style.display = "none";
  console.log("Close Modal");
}

// Function to save todo list to localStorage
function saveTodosToLocalStorage(todos) {
  localStorage.setItem("all-todo-list", JSON.stringify(todos));

  loadData();
}

// Function to render todos with pending status
function renderPending() {
  const todos = getAllTodos();
  const todoListDiv = document.getElementById("pending-todo-list");

  todoListDiv.innerHTML = "";

  todos.forEach((item) => {
    if (item.status === "pending") {
      const todoElement = document.createElement("div");
      todoElement.classList.add("todo");

      todoElement.innerHTML = `<p class="todo-task">${item.task}</p>

      <hr class="separator" />

      <div class="todo-action">
        <div class="priority-div" id="priority-div">
          <img
            src="/assets/left.png"
            alt="<"
            class="priority-change-icon"
            id="left-icon"
            onclick="priorityDec(${item.id}, '${item.priority}')"
          />
          <p class="priority">${item.priority}</p>
          <img
            src="/assets/right.png"
            alt=">"
            class="priority-change-icon"
            id="right-icon"
            onclick="priorityInc(${item.id}, '${item.priority}')"
          />
        </div>
        <div class="edit-delete">
          <button class="action-button edit-button" onclick="editTodo(${item.id})">Edit</button>
          <button class="action-button delete-button" onclick="deleteTodo(${item.id})">Delete</button>
          <button class="action-button complete-button" onclick="completeTodo(${item.id})">Complete</button>
        </div>
      </div>`;

      todoListDiv.appendChild(todoElement);
    }
  });
}

// Function to render todos with completed status
function renderCompleted() {
  const todos = getAllTodos();
  const todoListDiv = document.getElementById("complete-todo-list");

  todoListDiv.innerHTML = "";

  todos.forEach((item) => {
    if (item.status === "completed") {
      const todoElement = document.createElement("div");
      todoElement.classList.add("todo");

      todoElement.innerHTML = `<p class="todo-task">${item.task}</p>

      <hr class="separator" />

      <div class="todo-action">
        <div class="priority-div" id="priority-div">
          <img
            src="/assets/left.png"
            alt="<"
            class="priority-change-icon"
            id="left-icon"
            onclick="priorityDec(${item.id}, '${item.priority}')"
          />
          <p class="priority">${item.priority}</p>
          <img
            src="/assets/right.png"
            alt=">"
            class="priority-change-icon"
            id="right-icon"
            onclick="priorityInc(${item.id}, '${item.priority}')"
          />
        </div>
        <div class="edit-delete">
          <button class="action-button edit-button" onclick="editTodo(${item.id})">Edit</button>
          <button class="action-button delete-button" onclick="deleteTodo(${item.id})">Delete</button>
        </div>
      </div>`;

      todoListDiv.appendChild(todoElement);
    }
  });
}

// Function to render all data on load
function loadData() {
  console.log("Data Loading...");
  renderPending();
  renderCompleted();
}

loadData();
