"use strict";
const todoInput = document.getElementById("do-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.querySelector(".add-btn");
const editBtn = document.querySelector(".edit-btn");
const tbodyList = document.querySelector("tbody");
const deleteAll = document.querySelector(".input-btn_del");
const filterBtn = document.querySelectorAll(".input-btn");
const alertMessage = document.querySelector(".alert-message");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const deleteAllHandler = () => {
  if (todos.length) {
    const delAllQuestion = prompt("DELETE ALL TASK ? yes or no").toLowerCase();
    switch (delAllQuestion) {
      case "yes":
      case "y":
        localStorage.clear();
        window.location.reload();
        break;
      default:
        window.location.reload();
        break;
    }
  }
};
const doBtnHandler = (id) => {
  const newTodo = todos.find((todo) => todo.id === id);
  newTodo.complete = !newTodo.complete;
  if (newTodo.complete === true) {
    showAlert("You Do It", "success");
  } else {
    showAlert("OOPS", "error");
  }
  saveToLocalStorage();
  taskList();
};

const editHandler = (id) => {
  const newTodo = todos.find((todo) => todo.id === id);
  todoInput.value = newTodo.task;
  dateInput.value = newTodo.date;
  addBtn.style.display = "none";
  editBtn.style.display = "inline-block";
  editBtn.dataset.id = id;
};

const editHandlerResult = (event) => {
  const newId = +event.target.dataset.id;
  const newTodo = todos.find((todo) => todo.id === newId);
  newTodo.task = todoInput.value;
  newTodo.date = dateInput.value;
  editBtn.style.display = "none";
  addBtn.style.display = "inline-block";
  todoInput.value = "";
  dateInput.value = "";
  showAlert("Changed successfully", "success");
  saveToLocalStorage();
  taskList();
};

const deleteHandler = (id) => {
  const newTodo = todos.filter((todo) => todo.id !== id);
  todos = newTodo;
  showAlert("Removed successfully", "error");
  saveToLocalStorage();
  taskList();
};

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const generateId = () => {
  return (
    10000000 + Math.round(Math.random() * Math.random() * (99999999 - 10000000))
  );
};

const showAlert = (message, status) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${status}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alertMessage.style.display = "none";
  }, 2000);
  setTimeout(() => {
    alertMessage.style.display = "flex";
  });
};

const taskList = (data) => {
  const filteredList = data ? data : todos;
  tbodyList.innerHTML = "";
  if (!filteredList.length) {
    tbodyList.innerHTML = `<tr><td colspan="5">No Task Found!</td></tr>`;
    return;
  }
  filteredList.forEach((todo) => {
    tbodyList.innerHTML += `<tr>
    <td>${todo.task}</td>
    <td>${todo.date || "No Date"}</td>
    <td>${todo.complete ? "Completed" : "Pending"}</td>
    <td>
      <button onclick=doBtnHandler(${todo.id})>${
      todo.complete ? "Undo" : "Do"
    }</button>
      <button onclick=editHandler(${todo.id})>Edit</button>
      <button onclick="deleteHandler(${todo.id})">Delete</button>
    </td>  
    </tr>`;
  });
};

const addHandler = () => {
  const todoInputResult = todoInput.value.toLowerCase();
  const dateInputResult = dateInput.value;
  const todo = {
    id: generateId(),
    task: todoInputResult,
    date: dateInputResult,
    complete: false,
  };
  if (todoInputResult) {
    todos.push(todo);
    saveToLocalStorage();
    taskList();
    todoInput.value = "";
    dateInput.value = "";
    showAlert("Todo Added Successfully", "success");
  } else {
    showAlert("Please Add a Todo", "error");
  }
};

const filterHandler = (event) => {
  let filterTodo = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filterTodo = todos.filter((todo) => todo.complete === false);
      showAlert("The Pending List Is Showing", "success");
      break;
    case "completed":
      filterTodo = todos.filter((todo) => todo.complete === true);
      showAlert("The Completed List Is Showing", "success");
      break;
    default:
      filterTodo = todos;
      showAlert("All Tasks", "success");
  }

  taskList(filterTodo);
};

addBtn.addEventListener("click", addHandler);

editBtn.addEventListener("click", editHandlerResult);

window.addEventListener("load", () => taskList());

deleteAll.addEventListener("click", deleteAllHandler);

filterBtn.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
