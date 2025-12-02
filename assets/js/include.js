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
// Add this function to your include.js file (add after the existing functions)

function initPHSHeader() {
  const header = document.querySelector(".phs-header");
  const mobileMenuBtn = document.querySelector(".phs-mobile-menu-btn");
  const mobileNav = document.querySelector(".phs-mobile-nav");
  const mobileNavOverlay = document.querySelector(".phs-mobile-nav-overlay");
  const mobileNavClose = document.querySelector(".mobile-nav-close");
  const scrollProgressBar = document.querySelector(".scroll-progress-bar");

  if (!header) return;

  // Scroll animation for header
  function handleScroll() {
    // Header scroll effect
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Scroll progress bar
    if (scrollProgressBar) {
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollProgressBar.style.width = scrolled + "%";
    }
  }

  // Mobile menu toggle
  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle("active");
    mobileNav.classList.toggle("active");
    mobileNavOverlay.classList.toggle("active");
    document.body.style.overflow = mobileNav.classList.contains("active")
      ? "hidden"
      : "";
  }

  // Close mobile menu
  function closeMobileMenu() {
    mobileMenuBtn.classList.remove("active");
    mobileNav.classList.remove("active");
    mobileNavOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Set active navigation link
  function setActiveNavLink() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const desktopLinks = document.querySelectorAll(".nav-link");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    // Desktop links
    desktopLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const linkPage = href.replace(".html", "");
      const currentPageNoExt = currentPage.replace(".html", "");

      if (
        linkPage === currentPageNoExt ||
        (currentPage === "" && href === "https://pleasanthomestay.in") ||
        (currentPage === "index.html" && href === "https://pleasanthomestay.in")
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Mobile links
    mobileLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const linkPage = href.replace(".html", "");
      const currentPageNoExt = currentPage.replace(".html", "");

      if (
        linkPage === currentPageNoExt ||
        (currentPage === "" && href === "https://pleasanthomestay.in") ||
        (currentPage === "index.html" && href === "https://pleasanthomestay.in")
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Event listeners
  window.addEventListener("scroll", handleScroll);

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener("click", closeMobileMenu);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener("click", closeMobileMenu);
  }

  // Close mobile menu when clicking on links
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Initialize scroll state
  handleScroll();

  // Set active navigation
  setActiveNavLink();

  // Handle resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1024 && mobileNav.classList.contains("active")) {
      closeMobileMenu();
    }
  });
}

// Update the DOMContentLoaded event in include.js to call this function
document.addEventListener("DOMContentLoaded", function () {
  includeHTML();

  // Initialize header after includes are loaded
  setTimeout(function () {
    initPHSHeader();
  }, 200);

  // ... rest of your existing initialization code
});

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

  document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("#main-header");
    const mobileBtn = document.querySelector(".mobile-menu-btn");
    const navbar = document.querySelector(".navbar");
    const links = document.querySelectorAll(".nav-menu a");
    const underline = document.querySelector(".underline-indicator");
    const progress = document.querySelector(".scroll-progress-bar");

    /* Mobile menu toggle */
    mobileBtn.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });

    /* Auto close mobile nav on click */
    links.forEach((link) => {
      link.addEventListener("click", () => navbar.classList.remove("active"));
    });

    /* Scroll progress + shrink header */
    window.addEventListener("scroll", () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / height) * 100;
      progress.style.width = scrolled + "%";

      if (window.scrollY > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    });

    /* Desktop underline animation */
    if (window.innerWidth > 768) {
      links.forEach((link) => {
        link.addEventListener("mouseenter", function () {
          const rect = this.getBoundingClientRect();
          const parentRect = this.closest(".nav-menu").getBoundingClientRect();

          underline.style.width = rect.width + "px";
          underline.style.left = rect.left - parentRect.left + "px";
          underline.style.opacity = "1";
        });

        link.addEventListener("mouseleave", () => {
          underline.style.opacity = "0";
        });
      });
    }
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
  module.exports = { includeHTML, reinitializeScripts };
}
