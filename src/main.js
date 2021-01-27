const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#text-input");
const priorities = document.querySelector("#priority-selector");
const addTodo = document.querySelector("#add-button");

const counter = document.querySelector("#counter");

addTodo.addEventListener("click", (e) => {
  if (todoInput.value) {
    const listItem = document.createElement("li");

    const todoContainer = document.createElement("div");
    todoContainer.classList.add("todo-container");

    const todoCreatedAt = document.createElement("div");
    todoCreatedAt.classList.add("todo-created-at");
    todoCreatedAt.textContent = formatDate(new Date());
    todoContainer.appendChild(todoCreatedAt);

    const todoPriority = document.createElement("div");
    todoPriority.classList.add("todo-priority");
    todoPriority.textContent = priorities.value;
    todoContainer.appendChild(todoPriority);

    const todoText = document.createElement("div");
    todoText.classList.add("todo-text");
    todoText.textContent = todoInput.value;
    todoContainer.appendChild(todoText);

    counter.textContent++;

    todoInput.value = "";
    todoInput.focus();
    listItem.appendChild(todoContainer);
    todoList.appendChild(listItem);
  }
});

// Execute onClick button function when the user releases the enter key
todoInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    addTodo.click();
  }
});

// A function to format dates in SQL format
const formatDate = (date) => {
  const month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth();
  const day = date.getDate() < 10 ? "0" + (date.getDate() + 1) : date.getDate();
  const hour = date.getHours() < 10 ? "0" + (date.getHours() + 1) : date.getHours();
  const minute = date.getMinutes() < 10 ? "0" + (date.getMinutes() + 1) : date.getMinutes();
  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
}