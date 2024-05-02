const wrapper = document.querySelector(".wrapper");
const loginlink = document.querySelector(".login-link");
const registerlink = document.querySelector(".register-link");
const loginbtn = document.querySelector(".login-btn");
const iconClose = document.querySelector(".icon-close");

registerlink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

loginlink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

loginbtn.addEventListener("click", () => {
  wrapper.classList.add("active-popup");
});
iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popup");
});

function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    swal("Try again!", "Username already exists!", "error");
    return false;
  }

  users.push({ username, password, email });
  localStorage.setItem("users", JSON.stringify(users));

  swal("Good job!", "Registration successful!", "success");

  return false;
}

// API=================================

let apiUsers = [];
fetch("https://dummyjson.com/users")
  .then((response) => response.json())
  .then((data) => {
    apiUsers = data.users; // assuming the API returns an array of users under 'users' key
  })
  .catch((error) => console.error("Error fetching users:", error));

function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById("loginusername").value;
  const password = document.getElementById("loginpassword").value;

  // Check credentials against API users
  const user = apiUsers.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    // Call the login API to get a token
    fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("UserId", response.id);
          swal("Good job!", "Login successful!", "success").then(() => {
            window.location.href = "index.html"; // Redirect after successful login
          });
        } else {
          swal(
            "Error!",
            response.message || "Failed to login. Please try again later.",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Failed to fetch API:", error);
        swal(
          "Error!",
          "Failed to fetch API data. Please try again later.",
          "error"
        );
      });
  } else {
    swal("Try again!", "Invalid username or password!", "error");
  }
}


