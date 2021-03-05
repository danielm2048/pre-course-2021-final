const API = "http://localhost:5000/api/b";

// Gets every todo from the api
async function getTodos() {
  try {
    const response = await fetch(API, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      const todos = await response.json();
      return todos;
    }
    else {
      throw new Error(response.statusText);
    }
  } catch (err) {
    console.log(err);
  }
}

// Creates a todo and sends it to the api
async function createTodo(body) {
  try {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      const newTodoId = await response.text();
      return newTodoId;
    }
    else {
      throw new Error(response.statusText);
    }
  } catch (err) {
    console.log(err);
    alert("Can't create todo...");
  }
}

// Deletes every todo
async function deleteTodos() {
  try {
    const response = await fetch(API, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      return true;
    }
    else {
      throw new Error(response.statusText);
    }
  } catch (err) {
    console.log(err);
    alert("Can't delete todos...");
  }
}

// Gets a single todo from the api
async function getSingleTodo(id) {
  try {
    const response = await fetch(`${API}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      const todo = await response.json();
      return todo;
    }
    else {
      throw new Error(response.statusText);
    }
  } catch (err) {
    console.log(err);
    alert("Can't get todo...");
  }
}

// Updates a single todo and sends it to the api
async function updateSingleTodo(body) {
  try {
    const response = await fetch(`${API}/${body.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      return true;
    }
    else {
      throw new Error(response.statusText);
    }
  } catch (err) {
    console.log(err);
    alert("Can't update todo...");
  }
}

// Deletes a single todo
async function deleteSingleTodo(id) {
  try {
    const response = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      return true;
    }
    else {
      throw new Error(response.statusText);
    }
  } catch (err) {
    console.log(err);
    alert("Can't delete todo...");
  }
}

// Deletes every done todo
async function deleteDoneTodos() {
  try {
    const response = await fetch(`${API}/done`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      return true;
    }
    else {
      throw new Error(response.statusText);
    }
  } catch (err) {
    console.log(err);
    alert("Can't delete done todos...");
  }
}

function showSpinner() {
  document.querySelectorAll("button").disabled = true;
  loaderTitle.style.display = "inline-block";
}

function hideSpinner() {
  loaderTitle.style.display = "none";
  document.querySelectorAll("button").disabled = false;
}
