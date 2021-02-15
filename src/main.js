const container = document.querySelector(".main");
const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#text-input");
const priorities = document.querySelector("#priority-selector");

const addButton = document.querySelector("#add-button");
const updateButton = document.querySelector("#update-button");
const deleteButton = document.querySelector("#delete-button");
const deleteDoneButton = document.querySelector("#delete-done");

const loading = document.querySelector(".lds-roller");
const loaderTitle = document.querySelector(".title").querySelector(".lds-roller");
const counter = document.querySelector("#counter");
const extraButtons = document.querySelector(".extra-buttons");

let todos = [];
let selectedTodo = null;

// Make sure the todos load as the page loads
window.addEventListener("load", () => {
  getPersistent().then(data => {
    todos = data;

    if (todos.length) {
      deleteButton.style.display = "inline-block";
    }

    if (todos.filter(todo => todo.done).length) {
      deleteDoneButton.style.display = "inline-block";
    }

    todos.forEach((todo, index) => {
      todoList.appendChild(addTodo(todo.dateString, todo.priority, todo.text, todo.done, index));
    });

    counter.textContent = todos.length;
  });

  // Handle clicking on the add button
  addButton.addEventListener("click", () => {
    if (todoInput.value) {

      const date = new Date();
      const dateString = formatDate(date);
      const priority = priorities.value;
      const text = todoInput.value;

      todos.push({
        date,
        dateString,
        priority,
        text,
        done: false
      });

      todoInput.value = "";
      todoInput.focus();

      setPersistent(todos).then((status) => {
        if (status) {
          todoList.appendChild(addTodo(dateString, priority, text));
          counter.textContent++;

          if (todos.length === 1) {
            deleteButton.style.display = "inline-block";
          }
        }
      });
    }
  });

  // Handle clicking on the update button
  updateButton.addEventListener("click", () => {
    const priority = priorities.value;
    const text = todoInput.value;

    updateTodo(priority, text).then(() => {
      todoInput.value = "";
      todoInput.focus();
    });
  });

  // Handle clicking on the delete button
  deleteButton.addEventListener("click", () => {
    const answer = confirm("Are you sure you want to delete?");

    if (answer) {
      deleteTodo(selectedTodo ? selectedTodo[1] : -1).then(() => {
        counter.textContent = todos.length;

        if (!todos.length) {
          deleteButton.style.display = "none";
        }

        if (!todos.filter(todo => todo.done).length) {
          deleteDoneButton.style.display = "none";
        }
      })
    }
  });

  // Check if any todo has been double clicked to highlight it
  todoList.addEventListener("dblclick", toggleDoubleClick);

  // Because it's not possible to use double click on mobile,
  // mobile users will have to hold any todo for half a second to highlight it!
  let touchStartTime = 0;
  todoList.addEventListener("touchstart", () => {
    // Make sure tap won't highlight text
    document.body.style.userSelect = "noselect";
    touchStartTime = new Date().getTime();
  });
  todoList.addEventListener("touchend", (e) => {
    e.preventDefault();

    if (e.target.classList.contains("button")) {
      e.target.previousSibling.click();
    }
    else {
      const touchEndTime = new Date().getTime();
      if (touchEndTime - touchStartTime >= 500) {
        toggleDoubleClick(e);
      }
    }

    // Revert to normal
    document.body.style.userSelect = "auto";
  });

  // Execute onClick button function when the user releases the enter key
  todoInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();

      if (selectedTodo) {
        updateButton.click();
      }
      else {
        addButton.click();
      }
    }
  });

  // Check if any extra buttons(sort buttons and delete done todos button) have been clicked
  extraButtons.addEventListener("click", async (e) => {
    const prop = e.target.dataset.prop;
    if (prop) {
      // Priority sort needs to be in DESC order
      sortList(prop, prop !== "priority");
    }
    else if (e.target.id === "delete-done") {
      const answer = confirm("Are you sure you want to delete?");

      if (answer) {
        deleteTodo(-1, true).then(() => {
          counter.textContent = todos.length;

          deleteDoneButton.style.display = "none";
        })
      }
    }
  });

  // Check if any checkmarks have been clicked
  todoList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (index) {
      e.target.disabled = true;

      document.querySelectorAll(".todo-created-at")[index].classList.toggle("dimmed");
      document.querySelectorAll(".todo-priority")[index].classList.toggle("dimmed");
      document.querySelectorAll(".todo-text")[index].classList.toggle("crossed");
      document.querySelectorAll(".todo-text")[index].classList.toggle("dimmed");

      toggleDone(index).then(() => {
        e.target.disabled = false;
      })
    }
  });

  // This function creates a list item and returns it
  function addTodo(dateString, priority, text, done = false, index = todos.length - 1) {
    const listItem = document.createElement("li");

    const todoContainer = document.createElement("div");
    todoContainer.classList.add("todo-container");
    todoContainer.setAttribute("id", index);

    const todoCreatedAt = document.createElement("div");
    todoCreatedAt.classList.add("todo-created-at");
    todoCreatedAt.textContent = dateString;
    todoContainer.appendChild(todoCreatedAt);

    const todoPriority = document.createElement("div");
    todoPriority.classList.add("todo-priority");
    todoPriority.textContent = priority;
    todoContainer.appendChild(todoPriority);

    const todoText = document.createElement("div");
    todoText.classList.add("todo-text");
    todoText.textContent = text;
    todoContainer.appendChild(todoText);

    if (done) {
      todoCreatedAt.classList.add("dimmed");
      todoPriority.classList.add("dimmed");
      todoText.classList.add("crossed", "dimmed");
    }

    const todoCheck = createCheckmark(done, index);
    todoCheck.classList.add("todo-check");
    todoContainer.appendChild(todoCheck);

    listItem.appendChild(todoContainer);
    return listItem;
  }

  // A function for double clicking a todo from the list
  function toggleDoubleClick(e) {
    if (e.target.className === "todo-container" || e.target.parentNode.className === "todo-container") {
      const todoContainer = e.target.className === "todo-container" ? e.target : e.target.parentNode;
      if (selectedTodo) {
        selectedTodo[0].style.backgroundPosition = "0 -300%";

        if (selectedTodo[1] !== todoContainer.id) {
          todoContainer.style.backgroundPosition = "70% 100%";

          document.querySelector("#add-button").style.display = "none";
          document.querySelector("#update-button").style.display = "inline-block";
          document.querySelector("#delete-button").textContent = "Delete Todo 🗑️";

          selectedTodo = [todoContainer, todoContainer.id];
        }
        else {
          document.querySelector("#add-button").style.display = "inline-block";
          document.querySelector("#update-button").style.display = "none";
          document.querySelector("#delete-button").textContent = "Delete All 🗑️";

          selectedTodo = null;
        }
      }
      else {
        todoContainer.style.backgroundPosition = "70% 100%";

        document.querySelector("#add-button").style.display = "none";
        document.querySelector("#update-button").style.display = "inline-block";
        document.querySelector("#delete-button").textContent = "Delete Todo 🗑️";

        selectedTodo = [todoContainer, todoContainer.id];
      }
    }
  }

  // A function to update a todo from the list and from the array
  function updateTodo(priority, text) {
    todos[selectedTodo[1]].priority = priority;
    if (text) {
      todos[selectedTodo[1]].text = text;
    }

    return setPersistent(todos).then(() => {
      selectedTodo[0].querySelector(".todo-priority").textContent = priority;
      if (text) {
        selectedTodo[0].querySelector(".todo-text").textContent = text;
      }
      selectedTodo[0].style.backgroundPosition = "0 -300%";

      document.querySelector("#add-button").style.display = "inline-block";
      document.querySelector("#update-button").style.display = "none";
      document.querySelector("#delete-button").textContent = "Delete All 🗑️";

      selectedTodo = null;
    })
  }

  // A function to delete a todo from the list and from the array
  function deleteTodo(index, onlyDone = false) {
    let doneTodosToDelete = [];
    let remainingTodos = [];
    if (index === -1) {
      if (onlyDone) {
        // Get indices of done todos to remove them later
        // Get the other todos and put them in todos
        todos.forEach((todo, i) => {
          if (todo.done) {
            doneTodosToDelete.push(i);
          }
          else {
            remainingTodos.push(todo);
          }
        });
        todos = remainingTodos;
      }
      else {
        todos = [];
      }
    }
    else {
      todos.splice(index, 1);
    }

    return setPersistent(todos).then(() => {
      if (index === -1) {
        if (onlyDone) {
          for (let i = 0; i < doneTodosToDelete.length; i++) {
            todoList.removeChild(todoList.querySelector(`#\\3${doneTodosToDelete[i]}`).parentNode);
          }
        }
        else {
          while (todoList.hasChildNodes()) {
            todoList.removeChild(todoList.lastChild);
          }
        }
      }
      else {
        todoList.removeChild(todoList.querySelector(`#\\3${index}`).parentNode);

        document.querySelector("#add-button").style.display = "inline-block";
        document.querySelector("#update-button").style.display = "none";
        document.querySelector("#delete-button").textContent = "Delete All 🗑️";

        selectedTodo = null;
      }
    })
  };

  // A function to sort todo list by property
  // Direction is DESC for false, ASC for true 
  function sortList(prop, direction = false) {
    while (todoList.hasChildNodes()) {
      todoList.removeChild(todoList.lastChild);
    }

    // using date and not stringDate for a more precise sort
    if (prop === "date") {
      todos.sort((a, b) => {
        return direction ? new Date(a[prop]) - new Date(b[prop]) : new Date(b[prop]) - new Date(a[prop]);
      });
    }

    todos.sort((a, b) => {
      return direction ? a[prop] - b[prop] : b[prop] - a[prop];
    });

    todos.forEach((todo, index) => {
      todoList.appendChild(addTodo(todo.dateString, todo.priority, todo.text, todo.done, index));
    });
  }

  // A function to toggle done in the todos array and to display the correct buttons
  function toggleDone(index) {
    todos[index].done = !todos[index].done;

    if (todos.filter(todo => todo.done).length) {
      deleteDoneButton.style.display = "inline-block";
    }
    else {
      deleteDoneButton.style.display = "none";
    }

    return setPersistent(todos);
  }

  // A function to format dates in SQL format
  function formatDate(date) {
    const month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth();
    const day = date.getDate() < 9 ? "0" + (date.getDate() + 1) : date.getDate();
    const hour = date.getHours() < 9 ? "0" + (date.getHours() + 1) : date.getHours();
    const minute = date.getMinutes() < 9 ? "0" + (date.getMinutes() + 1) : date.getMinutes();
    return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
  }

  // A function for creating a checkmark
  function createCheckmark(done, index) {
    const todoCheck = document.createElement("div");
    const checkBox = document.createElement("input");
    const checkBoxLabel = document.createElement("label");
    const wrapper = document.createElement("div");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", `item-${index}`);
    checkBox.setAttribute("data-index", index);
    checkBox.checked = done;

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
});