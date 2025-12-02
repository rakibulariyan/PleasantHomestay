// include.js - Handles HTML includes and common functionality

// Function to load external HTML content
async function includeHTML() {
  const includeElements = document.querySelectorAll("[data-include]");

  for (let element of includeElements) {
    const file = element.getAttribute("data-include");

    try {
      const response = await fetch(file);

      if (!response.ok) {
        throw new Error(`Failed to load ${file}: ${response.statusText}`);
      }

      const html = await response.text();
      element.innerHTML = html;

      // Reinitialize any scripts that might be in the included content
      reinitializeScripts();
    } catch (error) {
      console.error("Error including HTML:", error);
      element.innerHTML = `<div class="error">Failed to load ${file}</div>`;
    }
  }
}

// Function to reinitialize scripts after including content
function reinitializeScripts() {
  // Update current year in footer
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Update current date if present
  const currentDateElements = document.querySelectorAll(".current-date");
  if (currentDateElements.length > 0) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateString = new Date().toLocaleDateString("en-US", options);
    currentDateElements.forEach((element) => {
      element.textContent = dateString;
    });
  }

  // Setup mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector("nav ul");

  if (mobileMenuBtn && navMenu) {
    // Remove existing event listeners to prevent duplicates
    const newMobileBtn = mobileMenuBtn.cloneNode(true);
    mobileMenuBtn.parentNode.replaceChild(newMobileBtn, mobileMenuBtn);

    // Add new event listener
    newMobileBtn.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking on links
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
      });
    });
  }

  // Setup smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Contact form handling
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert(
        "Thank you for your message! We will get back to you within 24 hours."
      );
      this.reset();
    });
  }

  // Initialize map if element exists
  const mapElement = document.getElementById("map");
  if (mapElement) {
    loadMapScript();
  }
}

// Load Leaflet map library and initialize map
function loadMapScript() {
  // Check if Leaflet is already loaded
  if (typeof L === "undefined") {
    // Load Leaflet CSS
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    leafletCSS.integrity =
      "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    leafletCSS.crossOrigin = "";
    document.head.appendChild(leafletCSS);

    // Load Leaflet JS
    const leafletJS = document.createElement("script");
    leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    leafletJS.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    leafletJS.crossOrigin = "";
    leafletJS.onload = initMap;
    document.head.appendChild(leafletJS);
  } else {
    // Leaflet already loaded, initialize map
    initMap();
  }
}

// Initialize map
function initMap() {
  // Coordinates for Hatigaon, Guwahati
  const pleasantHomestay = [26.1445, 91.7362];

  // Create map
  const map = L.map("map").setView(pleasantHomestay, 15);

  // Add tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add marker
  L.marker(pleasantHomestay)
    .addTo(map)
    .bindPopup(
      `
            <strong>Pleasant HomeStay</strong><br>
            Lakhmi Nagar Path, Hatigaon<br>
            Guwahati, Assam - 781006<br>
            <a href="https://maps.google.com/?q=26.1445,91.7362" target="_blank">Get Directions</a>
        `
    )
    .openPopup();

  // Add circle to show approximate location area
  L.circle(pleasantHomestay, {
    color: "#2c5530",
    fillColor: "#2c5530",
    fillOpacity: 0.1,
    radius: 200,
  }).addTo(map);
}

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-menu a");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    // Remove file extension for comparison
    const linkPage = linkHref.replace(".html", "");
    const currentPageNoExt = currentPage.replace(".html", "");

    if (
      linkPage === currentPageNoExt ||
      (currentPage === "" && linkHref === "index.html") ||
      (currentPage === "/" && linkHref === "index.html")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  includeHTML();

  // Set active navigation link after includes are loaded
  setTimeout(setActiveNavLink, 200);

  // Initialize map if on a page with map
  if (document.getElementById("map") && typeof L !== "undefined") {
    initMap();
  }
});

// Export functions for use in other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { includeHTML, reinitializeScripts, initMap };
}

// Header functionality
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const underlineIndicator = document.querySelector(".underline-indicator");
  const scrollProgressBar = document.querySelector(".scroll-progress-bar");

  // Mobile Menu Toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      navbar.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navbar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navbar.classList.remove("active");
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navbar.classList.remove("active");
    });
  });

  // Underline indicator on hover
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const linkRect = this.getBoundingClientRect();
      const navRect = this.closest(".nav-menu").getBoundingClientRect();

      underlineIndicator.style.width = linkRect.width + "px";
      underlineIndicator.style.left = linkRect.left - navRect.left + "px";
      underlineIndicator.style.opacity = "1";
    });

    link.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        underlineIndicator.style.opacity = "0";
      }
    });
  });

  // Update active link underline
  function updateActiveLinkIndicator() {
    const activeLink = document.querySelector(".nav-menu a.active");
    if (activeLink && underlineIndicator) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = activeLink.closest(".nav-menu").getBoundingClientRect();

      underlineIndicator.style.width = linkRect.width + "px";
      underlineIndicator.style.left = linkRect.left - navRect.left + "px";
      underlineIndicator.style.opacity = "1";
    }
  }

  // Update on load
  updateActiveLinkIndicator();

  // Scroll Progress Bar
  function updateScrollProgress() {
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgressBar.style.width = scrolled + "%";

    // Header scroll effect
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // Update on scroll
  window.addEventListener("scroll", updateScrollProgress);

  // Update on resize
  window.addEventListener("resize", function () {
    updateActiveLinkIndicator();
  });

  // Initialize
  updateScrollProgress();

  // Update underline indicator on page load
  setTimeout(updateActiveLinkIndicator, 100);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,

            behavior: "smooth",
          });
        }
      }
    });
  });
});
