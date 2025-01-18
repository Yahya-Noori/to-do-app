const taskName = document.getElementById("task-name");
const taskDate = document.getElementById("task-date");
const addBtn = document.getElementById("add-btn");
const alertMessage = document.getElementById("alert-message");
const toDosbody = document.querySelector("tbody");
const deleteAllBtn = document.getElementById("delete-all");
const deleteBtn = document.getElementById("one-item-deleting");
const editBtn = document.getElementById("edit-btn");
const filterBtn = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const generateId = () => {
  return Math.floor(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const addingTaskHandler = () => {
  const task = taskName.value;
  const date = taskDate.value;
  const todo = {
    id: generateId(),
    task,
    date,
    status: false,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayToDos();
    taskName.value = "";
    taskDate.value = "";
    showAlert("Your task added successfully!", "success");
  } else {
    showAlert("Please enter a task.", "error");
  }
};

const displayToDos = (data) => {
  const todoList = data || todos;
  toDosbody.innerHTML = "";
  if (!todoList.length) {
    toDosbody.innerHTML = "<tr><td colspan='4'>No taks found!</td></tr>";
    return;
  }

  todoList.forEach((todo) => {
    toDosbody.innerHTML += `
    <tr>
    <td>${todo.task}</td>
    <td>${todo.date || "Not a certain palan!"}</td>
    <td>${todo.status ? "completed" : "pending"}</td>
    <td>
    <button class = "btn" style = "padding: 6px; font-size : 13px;" onclick = "editHandler('${
      todo.id
    }')">Edit</button>

    <button onclick="toggleHandler('${
      todo.id
    }')" class = "btn do-btn" style = "padding: 6px; font-size : 13px;">
    ${todo.status ? "Start" : "Done"}
    </button>

    <button onclick="oneItemDeletingHandler('${
      todo.id
    }')" class = "btn delete-btn" style = "padding: 6px; font-size : 13px;">Delete</button>

    </td>
    </tr>
    `;
  });
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayToDos();
    showAlert("Tasks cleared successfully!", "success");
  } else {
    showAlert("No tasks to clear.", "error");
  }
};

const oneItemDeletingHandler = (id) => {
  const newToDos = todos.filter((todo) => todo.id !== id);
  todos = newToDos;
  saveToLocalStorage();
  displayToDos();
  showAlert("task deleted successfully!", "success");
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.status = !todo.status;
  saveToLocalStorage();
  displayToDos();
  showAlert("Task's status changed successfully.", "success");
};

const editHandler = (id) => {
  const todo = todos.filter((todo) => todo.id === id);
  taskName.value = todo[0].task;
  taskDate.value = todo[0].date;
  editBtn.style.display = "inline-block";
  addBtn.style.display = "none";
  editBtn.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.filter((todo) => todo.id === id);
  todo[0].task = taskName.value;
  todo[0].date = taskDate.value;
  console.log(todo[0].task);
  taskName.value = "";
  taskDate.value = "";
  editBtn.style.display = "none";
  addBtn.style.display = "inline-block";
  saveToLocalStorage();
  displayToDos();
  showAlert("Task edited successfully.", "success");
};

const filterHandler = (event) => {
  const filter = event.target.dataset.filter;
  let filteredTodos = null;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.status === false);
      break;

    case "completed":
      filteredTodos = todos.filter((todo) => todo.status === true);
      break;

    default:
      filteredTodos = todos;
      break;
  }

  displayToDos(filteredTodos);
};

window.addEventListener("load", () => displayToDos());
addBtn.addEventListener("click", addingTaskHandler);
deleteAllBtn.addEventListener("click", deleteAllHandler);
editBtn.addEventListener("click", applyEditHandler);
filterBtn.forEach((btn) => {
  btn.addEventListener("click", filterHandler);
});
