const API_KEY = "$2b$10$VnuEYMRRNgcZ.iBkOcV.VOxxEOQCVMganefJqn9bPvcpjTh/6KuBe"; // Assign this variable to your JSONBIN.io API key if you choose to use it.
const API = "https://api.jsonbin.io/v3/b/6012ab509f55707f6dfd3565";
const DB_NAME = "my-todo";

// Gets data from persistent storage by the given key and returns it
async function getPersistent(key = API_KEY) {
  const response = await fetch(`${API}/latest`, {
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": key
    }
  });
  if (response.ok) {
    const bin = await response.json();
    return bin.record[DB_NAME];
  }
  else {
    console.log(response.text());
  }
}

// Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
async function setPersistent(data, key = API_KEY) {
  const response = await fetch(API, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": key
    },
    body: JSON.stringify({ "my-todo": data })
  });
  if (response.ok) {
    return true;
  }
  else {
    console.log(response.text())
  }
}

// A function for handling the wair for setPersistent
async function waitForPersistent(showLoader = true) {
  // Loader next to title
  const loaderTitle = document.querySelector(".title").querySelector(".lds-roller");

  document.querySelectorAll("button").disabled = true;
  loaderTitle.style.display = showLoader ? "inline-block" : "none";

  await setPersistent(todos);

  loaderTitle.style.display = "none";
  document.querySelectorAll("button").disabled = false;
}
