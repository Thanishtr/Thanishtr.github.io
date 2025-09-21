document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Toggle ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // --- Portfolio Filter Logic ---
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".gallery-item");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active-filter"));
      button.classList.add("active-filter");
      const filter = button.dataset.filter;
      portfolioItems.forEach((item) => {
        const category = item.dataset.category;
        const isHiddenByDefault = item.classList.contains("hidden-by-default");
        const shouldShow =
          (filter === "all" && !isHiddenByDefault) ||
          (filter !== "all" && category === filter);
        if (shouldShow) {
          item.classList.add("is-visible");
        } else {
          item.classList.remove("is-visible");
        }
      });
    });
  });
  // Trigger initial filter on page load
  document.querySelector('.filter-btn[data-filter="all"]').click();

  // --- General Scroll Animations ---
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  animatedElements.forEach((el) => observer.observe(el));

  // --- Dynamic Year in Footer ---
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // --- WhatsApp Button Visibility ---
  const whatsappButton = document.getElementById("whatsapp-button");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      whatsappButton.classList.add("visible");
    } else {
      whatsappButton.classList.remove("visible");
    }
  });

  // --- Contact Form & Notification Logic ---
  const contactForm = document.getElementById("contact-form");
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");

  // Function to show the notification
  function showNotification(message, type) {
    notificationMessage.textContent = message;
    notification.className = `notification ${type} show`;

    // Hide notification after 4 seconds
    setTimeout(() => {
      notification.classList.remove("show");
    }, 4000);
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the form from submitting the traditional way

    // Custom Validation
    if (!contactForm.checkValidity()) {
      showNotification("Please fill out all required fields.", "error");
      return;
    }

    // Send data using Fetch API
    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          showNotification("Message sent successfully!", "success");
          contactForm.reset();
        } else {
          response.json().then((data) => {
            if (Object.hasOwn(data, "errors")) {
              const errorMessage = data["errors"]
                .map((error) => error["message"])
                .join(", ");
              showNotification(errorMessage, "error");
            } else {
              showNotification(
                "Oops! Something went wrong. Please try again.",
                "error"
              );
            }
          });
        }
      })
      .catch((error) => {
        showNotification(
          "Oops! Something went wrong. Please try again.",
          "error"
        );
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      });
  });
});