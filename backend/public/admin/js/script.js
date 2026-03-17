/**
 * TravelLand Admin
 */

// Sidebar
document.addEventListener('DOMContentLoaded', function() {
  // Sidebar Toggle Functionality
  const sidebar = document.getElementById('adminSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  // Open sidebar
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Close sidebar
  function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Active Navigation Link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href) {
      const isExactMatch = currentPath === href;
      const isParentMatch = currentPath.startsWith(href + '/') || currentPath.startsWith(href + '?');
      
      let hasMoreSpecificMatch = false;
      navLinks.forEach(function(otherLink) {
        const otherHref = otherLink.getAttribute('href');
        if (otherHref && otherHref !== href && otherHref.startsWith(href) && currentPath.startsWith(otherHref)) {
          hasMoreSpecificMatch = true;
        }
      });

      if ((isExactMatch || isParentMatch) && !hasMoreSpecificMatch) {
        link.classList.add('active');
      } else if (isExactMatch) {
        link.classList.add('active');
      }
    }
  });

  // Alert Auto Close
  const alertBox = document.querySelector('[show-alert]');
  
  if (alertBox) {
    // Auto hide after 5 seconds
    setTimeout(function() {
      alertBox.classList.add('alert-hidden');
    }, 5000);

    // Close button
    const closeAlertBtn = alertBox.querySelector('[close-alert]');
    if (closeAlertBtn) {
      closeAlertBtn.addEventListener('click', function() {
        alertBox.classList.add('alert-hidden');
      });
    }
  }

  // Bootstrap Dropdowns Enhancement
  const dropdownElementList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
  dropdownElementList.forEach(function(dropdownToggleEl) {
    dropdownToggleEl.addEventListener('shown.bs.dropdown', function() {
      this.closest('.dropdown').classList.add('show');
    });
    dropdownToggleEl.addEventListener('hidden.bs.dropdown', function() {
      this.closest('.dropdown').classList.remove('show');
    });
  });

  // Form Validation Enhancement
  const forms = document.querySelectorAll('.needs-validation');
  
  forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  // Image Preview
  const imageInputs = document.querySelectorAll('input[type="file"][data-preview]');
  
  imageInputs.forEach(function(input) {
    input.addEventListener('change', function() {
      const previewId = this.getAttribute('data-preview');
      const previewImg = document.getElementById(previewId);
      
      if (previewImg && this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          previewImg.src = e.target.result;
        };
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  });

  // Tooltip Initialization
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(function(tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Card Animation on Scroll
  const animatedElements = document.querySelectorAll('.card, .stat-card');
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });

  console.log('TravelLand Admin Panel initialized successfully!');
});
// End Sidebar

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]"
  );
  uploadImageInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      const imageFile = URL.createObjectURL(e.target.files[0]);
      uploadImagePreview.src = imageFile;
    }
  });
}
// End Upload Image

// Toggle Password
const buttonsTogglePassword = document.querySelectorAll("[toggle-password]");
if (buttonsTogglePassword.length > 0) {
  buttonsTogglePassword.forEach(button => {
    button.addEventListener("click", () => {
      const icon = button.querySelector("i");
      const inputPassword = button.parentElement.querySelector("input");
      
      if (inputPassword.type === "password") {
        inputPassword.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        inputPassword.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });
}
// End Toggle Password