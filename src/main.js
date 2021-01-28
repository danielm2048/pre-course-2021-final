let todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#text-input");
const priorities = document.querySelector("#priority-selector");
const todoButton = document.querySelector("#add-button");
const todos = [];

const counter = document.querySelector("#counter");
const sortButton = document.querySelector("#sort-button");

todoButton.addEventListener("click", () => {
  if (todoInput.value) {

    const todoCreatedAt = formatDate(new Date());
    const todoPriority = priorities.value;
    const todoText = todoInput.value;

    todoList.appendChild(addTodo(todoCreatedAt, todoPriority, todoText));

    todos.push({
      todoCreatedAt,
      todoPriority,
      todoText
    });

    counter.textContent++;

    todoInput.value = "";
    todoInput.focus();
  }
});

// Execute onClick button function when the user releases the enter key
todoInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter" || e.code === "NumpadEnter") {
    e.preventDefault();
    todoButton.click();
  }
});

sortButton.addEventListener("click", () => {
  sortList("todoPriority");
})

// This function creates a list item and returns it
const addTodo = (date, priority, text) => {
  const listItem = document.createElement("li");

  const todoContainer = document.createElement("div");
  todoContainer.classList.add("todo-container");

  const todoCreatedAt = document.createElement("div");
  todoCreatedAt.classList.add("todo-created-at");
  todoCreatedAt.textContent = date;
  todoContainer.appendChild(todoCreatedAt);

  const todoPriority = document.createElement("div");
  todoPriority.classList.add("todo-priority");
  todoPriority.textContent = priority;
  todoContainer.appendChild(todoPriority);

  const todoText = document.createElement("div");
  todoText.classList.add("todo-text");
  todoText.textContent = text;
  todoContainer.appendChild(todoText);

  listItem.appendChild(todoContainer);
  return listItem;
}

// A function to sort todo list by property
const sortList = (prop) => {
  const parent = todoList.parentNode;
  parent.removeChild(todoList);
  todoList = document.createElement("ul");

  todos.sort((a, b) => {
    return b[prop] - a[prop];
  });

  todos.forEach(todo => {
    todoList.appendChild(addTodo(todo.todoCreatedAt, todo.todoPriority, todo.todoText));
  });

  parent.appendChild(todoList);
}

// A function to format dates in SQL format
const formatDate = (date) => {
  const month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth();
  const day = date.getDate() < 10 ? "0" + (date.getDate() + 1) : date.getDate();
  const hour = date.getHours() < 10 ? "0" + (date.getHours() + 1) : date.getHours();
  const minute = date.getMinutes() < 10 ? "0" + (date.getMinutes() + 1) : date.getMinutes();
  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
}