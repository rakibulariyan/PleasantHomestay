async function includeHTML() {
  const elements = document.querySelectorAll("[data-include]");
  for (let el of elements) {
    const file = el.getAttribute("data-include");
    const response = await fetch(file);
    const html = await response.text();
    el.innerHTML = html;
  }
}

includeHTML();

function toggleMenu() {
  document.querySelector("nav ul").classList.toggle("active");
}

// Update current year in footer
document.addEventListener("DOMContentLoaded", function () {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// Add this script to each HTML file (in the existing script tag)
document.addEventListener("DOMContentLoaded", function () {
  // Update dynamic date
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", options);

  // Update all date displays
  document.querySelectorAll(".current-date").forEach((element) => {
    element.textContent = dateString;
  });

  // Existing mobile menu code...
  document
    .querySelector(".mobile-menu-btn")
    ?.addEventListener("click", function () {
      document.querySelector("nav ul").classList.toggle("active");
    });

  // Close mobile menu when clicking on a link
  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", function () {
      document.querySelector("nav ul").classList.remove("active");
    });
  });
});
