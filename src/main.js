const container = document.querySelector(".main");
let todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#text-input");
const priorities = document.querySelector("#priority-selector");
const todoButton = document.querySelector("#add-button");

const loading = document.querySelector(".lds-roller");
const counter = document.querySelector("#counter");
const sortButton = document.querySelector("#sort-button");

let todos = [];

// This function creates a list item and returns it
const addTodo = (date, priority, text, index) => {
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

  const todoCheck = createCheckmark(index);
  todoCheck.classList.add("todo-check");
  todoContainer.appendChild(todoCheck);

  listItem.appendChild(todoContainer);
  return listItem;
}

// Get todos when the page loads
window.addEventListener("load", async () => {
  container.style.display = "none";

  todos = await getPersistent();

  loading.style.display = "none";
  container.style.display = "block";

  todos.forEach((todo, index) => {
    todoList.appendChild(addTodo(todo.date, todo.priority, todo.text, index));
  });

  counter.textContent = todos.length;
});

todoButton.addEventListener("click", async () => {
  if (todoInput.value) {

    const date = formatDate(new Date());
    const priority = priorities.value;
    const text = todoInput.value;

    todoList.appendChild(addTodo(date, priority, text));

    todos.push({
      date,
      priority,
      text
    });

    counter.textContent++;

    todoInput.value = "";
    todoInput.focus();

    await setPersistent(todos);
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
  sortList("priority");
})

// A function to sort todo list by property
const sortList = (prop) => {
  const parent = todoList.parentNode;
  parent.removeChild(todoList);
  todoList = document.createElement("ul");

  todos.sort((a, b) => {
    return b[prop] - a[prop];
  });

  todos.forEach((todo, index) => {
    todoList.appendChild(addTodo(todo.date, todo.priority, todo.text, index));
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

// A function for creating a checkmark
const createCheckmark = (index) => {
  const todoCheck = document.createElement("div");
  const checkBox = document.createElement("input");
  const checkBoxLabel = document.createElement("label");
  const wrapper = document.createElement("div");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("id", `item-${index}`);

  checkBoxLabel.setAttribute("for", `item-${index}`);
  checkBoxLabel.classList.add("button");

  wrapper.classList.add("wrapper");

  svg.setAttribute("x", "0px");
  svg.setAttribute("y", "0px");
  svg.setAttribute("viewBox", "0 0 98.5 98.5");
  svg.setAttribute("enable-background", "new 0 0 98.5 98.5");

  path.classList.add("checkmark");
  path.setAttribute("stroke-width", "8");
  path.setAttribute("stroke-miterlimit", "10");
  path.setAttribute("d", "M81.7,17.8C73.5,9.3,62,4,49.2,4C24.3,4,4,24.3,4,49.2s20.3,45.2,45.2,45.2s45.2-20.3,45.2-45.2c0-8.6-2.4-16.6-6.5-23.4l0,0L45.6,68.2L24.7,47.3");

  svg.appendChild(path);
  wrapper.appendChild(svg);
  todoCheck.appendChild(checkBox);
  todoCheck.appendChild(checkBoxLabel)
  todoCheck.appendChild(wrapper);
  return todoCheck;
}