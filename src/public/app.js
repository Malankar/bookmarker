let userData = null;

// DOM elements
const bookmarkForm = document.getElementById("bookmarkForm");
const bookmarksList = document.getElementById("bookmarksList");

// Event listener for form submission
bookmarkForm.addEventListener("submit", addBookmark);

// Add bookmark
function addBookmark(e) {
  e.preventDefault();

  const title = document.getElementById("siteName").value;
  const url = document.getElementById("siteUrl").value;

  if (!validateForm(title, url)) {
    return;
  }

  const payload = {};
  payload.title = title;
  payload.url = url;
  console.log("payload:: ", payload);

  fetch("/v1/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  bookmarkForm.reset();
  displayBookmarks();
}

// Display bookmarks
async function displayBookmarks() {
  if(!userData){
    fetchUserData();
  }

  const response = await fetch("/v1/bookmarks");
  const bookmarks = await response.json();
  bookmarksList.innerHTML = "";
  bookmarks?.forEach((bookmark) => {
    let bookmarkId = bookmark.id;
    bookmarksList.innerHTML += `
      <div class="bookmark">
        <a href="${bookmark.url}" target="_blank" id="${bookmarkId}">${bookmark.title}</a>
        <button id="deleteButton" onclick="deleteBookmark('${bookmarkId}')">Delete</button>
      </div>
    `;
  });
}

async function fetchUserData() {
  try {
      const response = await fetch('/v1/user');
      const data = await response.json();
      userData = data.user;
      profilePhoto.src = `https://robohash.org/${userData.nickname}?set=set3`;
      profilePhoto.style.display = 'block';
  } catch (error) {
      console.error('Error fetching user data:', error);
  }
}

// Delete bookmark
async function deleteBookmark(id) {
  try {
    const response = await fetch(`/v1/bookmarks/${id}`, {
      method: "DELETE",
    });
    if (response.status == 204)
      console.log("bookmark was deleted successfully");
    displayBookmarks();
  } catch (error) {
    console.error("Error:", error);
  }
}

// Form validation
function validateForm(siteName, siteUrl) {
  if (!siteName || !siteUrl) {
    alert("Please fill in both fields");
    return false;
  }

  const expression = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/;
  const regex = new RegExp(expression);

  if (!siteUrl.match(regex)) {
    alert("Please use a valid URL");
    return false;
  }

  return true;
}

// Initial display of bookmarks
document.addEventListener("DOMContentLoaded", displayBookmarks);
