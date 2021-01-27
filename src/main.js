const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#text-input");
const priorities = document.querySelector("#priority-selector");
const addTodo = document.querySelector("#add-button");

addTodo.addEventListener("click", (e) => {
  if (todoInput.value) {
    const date = formatDate(new Date());
    const priority = priorities.options[priorities.selectedIndex].text;
    const todo = document.createElement("li");
    todo.textContent = `${date} ${priority} ${todoInput.value}`;
    todoInput.value = "";
    todoList.appendChild(todo);
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
  return `${date.getFullYear()}-${month}-${day}`;
}