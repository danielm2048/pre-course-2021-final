const API_KEY = "$2b$10$VnuEYMRRNgcZ.iBkOcV.VOxxEOQCVMganefJqn9bPvcpjTh/6KuBe"; // Assign this variable to your JSONBIN.io API key if you choose to use it.
const API = "https://api.jsonbin.io/v3/b/6012ab509f55707f6dfd3565";
const DB_NAME = "my-todo";

// XMLHttpRequest function
function sendHttpRequest(method, url, data, showLoader) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.responseType = "json";

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-Master-Key", API_KEY);

    xhr.upload.onprogress = () => {
      if (data) {
        document.querySelectorAll("button").disabled = true;
        loaderTitle.style.display = showLoader ? "inline-block" : "none";
      } else {
        container.style.display = "none";
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
        if (data) {
          loaderTitle.style.display = "none";
          document.querySelectorAll("button").disabled = false;
        } else {
          loading.style.display = "none";
          container.style.display = "block";
        }
      }
    };

    xhr.onerror = () => {
      reject("Error!");
    };

    const body = JSON.stringify({ "my-todo": data });

    xhr.send(body);
  });
  return promise;
}

// Gets data from persistent storage by the given key and returns it
function getPersistent() {
  return sendHttpRequest("GET", `${API}/latest`).then(
    (res) => res.record[DB_NAME]
  );
}

// Saves the given data into persistent storage by the given key.
function setPersistent(data, showLoader = true) {
  return sendHttpRequest("PUT", API, data, showLoader)
    .then((res) => res.record[DB_NAME] !== null)
    .catch((err) => console.log(err));
}
