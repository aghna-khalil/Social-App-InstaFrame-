// Asynchronously fetch and display posts and users
let lastDisplayedIndex = 9;
async function fetchAndDisplayPosts() {
  try {
    const postsResponse = await fetch(`https://dummyjson.com/posts`);
    const postsData = await postsResponse.json();
    var UserId = localStorage.getItem("UserId");
    const usersResponse = await fetch("https://dummyjson.com/users");
    const usersData = await usersResponse.json();

    const postList = document.getElementById("postList");
    for (let i = lastDisplayedIndex + 1; i <= lastDisplayedIndex + 10; i++) {
      if (i >= postsData.posts.length) {
        // If there are no more posts, break the loop
        break;
      }
      // console.log(postsData);
      const post = postsData.posts[i];
      const user = usersData.users[i % usersData.users.length];
      const postElement = document.createElement("div");
      postElement.classList.add("mt-2", "mb-3");
      postElement.innerHTML = buildPostHtml(post, user);
      postList.appendChild(postElement);
    }
    lastDisplayedIndex += 10; // Update the index of the last displayed post
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
window.addEventListener("scroll", function () {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    fetchAndDisplayPosts(); // Fetch and display next 10 posts
  }
});

// Function to return the HTML for each post
function buildPostHtml(post, user) {
  return `
    <div class="feed " >
      <div class="head card-header d-flex justify-content-between" ">
        <div class="user d-flex ms-1">
          <div class="profile-picture">
            <img src=${user.image} alt="">
          </div>
          <div class="info">
            <h3 style="font-size: 1rem; font-weight: bold; margin-bottom: 0;">${user.username}</h3>
            <small class="text-muted">${user.address.city}</small>
          </div>
        </div>
        <span class="edit"><i class="fa-solid fa-ellipsis"></i></span>
      </div>
      <div class="photo d-block" id="photo-container">
        <img src="assets/story11.jpg" alt="">
      </div>
      <div class="action-button d-flex justify-content-between mt-2 p-2 align-items-center">
        <div class="interaction-button">
          <span><i class="fa-regular fa-heart"></i></span>
          <a><span><i class="fa-regular fa-comment"></i></span></a>
          <span><i class="fa-regular fa-paper-plane"></i></span>
        </div>
        <div class="bookmarks">
          <span><i class="fa-regular fa-bookmark"></i></span>
        </div>
      </div>
      <div class="liked-by d-flex justify-content-start ps-3">
        <span><img src="assets/dp1.jpg" alt=""></span>
        <span><img src="assets/dp0.jpg" alt=""></span>
        <span><img src="assets/dps2.jpg" alt=""></span>
        <p>Liked by <b>Hamza Nisar</b>and <b>2,324 others.</b></p>
      </div>
      <div class="post-body d-flex justify-content-start ps-3">
        
        <p>${post.body}</p>
      </div>
      <form class="add-comment d-flex justify-content-between p-2 align-items-center" post-id="${post.id}" user-id="${user.id}">
        <div class="profile-picture">
          <img src="${user.image}" alt="">
        </div>
        <input type="text" placeholder="add comment" id="add-comment" class="ms-1 form-control me-2" style="height: 39px;">
        <input type="submit" value="Add" class="btn btn-primary" style="background-color: var(--color-primary); padding:0 1rem; width: 100px; height:39px;">
      </form>
      <div class="view-all-comment mt-1 mb-1 p-2">
        <a href="" post-id="${post.id}" user-id="${user.id}" class="text-muted" data-bs-toggle="modal" data-bs-target="#commentsModal">view all comments</a>
      </div>

  `;
}

// Initialize fetch operation on DOM content load
document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayPosts(11);

  // Event listener view all comments
  document.body.addEventListener("click", function (event) {
    if (event.target.matches(".view-all-comment a")) {
      event.preventDefault();
    }
  });

  // Event listener for adding comments
  document.body.addEventListener("submit", function (event) {
    if (event.target.matches(".add-comment")) {
      event.preventDefault();
      const postId = event.target.getAttribute("post-id");
      const userId = event.target.getAttribute("user-id");
      const commentInput = event.target.querySelector('input[type="text"]');
      const commentBody = commentInput.value.trim();

      comment_add =
        '<div class="view-comment"><div class=" d-flex justify-content-between"><div class="user-comment-side d-flex"><div class="profile-picture"><img src="assets/dp0.jpg" alt=""></div><div class="comment-info d-flex flex-column"><h3 style="font-size: 1rem;font-weight: bold;margin-bottom: 0;text-align: center;" class="my-2 mx-1">Ramshah shah</h3><p class="comment-of-user text-muted ms-3">' +
        commentBody +
        '</p></div></div><div class="comment-action d-flex justify-content-between"><button class="delete-btn btn-primary rounded h-50" data-comment-id="${comment.id}">Delete</button></div></div><hr></div>';

      if (commentBody !== "") {
        const commentsList = document.getElementById("commentsList");
        commentsList.innerHTML += comment_add;
        // Use postId and userId here as needed
        postComment(commentBody, userId, postId);
        commentInput.value = "";
      }
    }
  });
});

function postComment(commentBody, userId, postId) {
  console.log("Posting comment:", commentBody);
  fetch("https://dummyjson.com/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: commentBody,
      postId: postId, // Assuming postId and userId are static for now
      userId: userId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Comment added:", data);

      // fetchAndPopulateComments(11); // Fetch and display updated comments
    })
    .catch((error) => console.error("Error adding comment:", error));
}
// Attach event listener for deleting comments
document.body.addEventListener("click", function (event) {
  if (event.target.matches(".delete-btn")) {
    event.preventDefault(); // Prevent default form submission behavior if applicable
    const commentId = event.target.getAttribute("data-comment-id");
    if (commentId) {
      deleteComment(commentId);
      // Remove the parent .view-comment element
      const parentViewComment = event.target.closest(".view-comment");
      if (parentViewComment) {
        parentViewComment.remove();
      }
    }
  }
});

function deleteComment(commentId) {
  fetch(`https://dummyjson.com/comments/${commentId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Comment not found");
    })
    .then((data) => {
      const commentDiv = document.getElementById(`comment-${commentId}`);

      swal("Are you Sure?", "Once you delete you lost data!", "warning");
      console.log("Comment deleted:", data);
      console.log("updated list of comments is:");
      // fetchAndPopulateComments(11);
    })
    .catch((error) => console.error("Error deleting comment:", error));
}

// Function to fetch and display comments
async function fetchAndPopulateComments(postId) {
  try {
    postId = postId || 11;
    const commentsResponse = await fetch(
      "https://dummyjson.com/comments?postId=" + postId
    );
    if (!commentsResponse.ok) {
      throw new Error("Failed to fetch comments");
    }
    const commentsData = await commentsResponse.json();
    console.log(commentsData);
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");
    commentDiv.id = `comment-${postId}`;
    const commentsList = document.getElementById("commentsList");
    commentsList.innerHTML = "";
    commentsData.comments.forEach((comment) => {
      const commentElement = `
        <div class="view-comment all_comments d-flex justify-content-between">
          <div class="user-comment-side d-flex">
            <div class="profile-picture">
              <img src="assets/story10.jpg" alt="" /> 
            </div>
            <div class="comment-info d-flex flex-column">
              <h3 style="font-size: 1rem; font-weight: bold; margin-bottom: 0; text-align: center;" class="my-2 mx-1">${comment.user.username}</h3>
              <p class="comment-of-user text-muted ms-3">${comment.body}</p>
            </div>
          </div>
          <div class="comment-action d-flex justify-content-between">
            <button data-comment-id="${comment.id}" class="delete-btn btn-primary rounded h-50">Delete</button>
          </div>
        </div>
        <hr />
        
      `;
      commentsList.insertAdjacentHTML("beforeend", commentElement);
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

// search post

document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to all elements with the class "btn"
  const buttons = document.querySelectorAll(".btn_search");
  buttons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      // Get the value of the search input
      const searchValue = document.getElementById("searchInput").value;
      fetchSearchData(searchValue);
      // console.log("Search value:", searchValue);
    });
  });
});

function fetchSearchData(data) {
  fetch("https://dummyjson.com/posts/search?q=" + data)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.posts);
      displaysearchPosts(data.posts);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function displaysearchPosts(posts) {
  const searchInput = document.getElementById("serach_data");

  posts.forEach((post) => {
    console.log(post.body);
    const postBody = document.createElement("div");
    postBody.innerHTML = `
      <p>${post.body}</p>
    `;

    searchInput.appendChild(postBody);
    searchInput.style.display = "block";
  });
}
