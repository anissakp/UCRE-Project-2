// nav.js - Global navigation bar for all pages

(function() {
  // Create navigation HTML
  const navHTML = `
    <nav id="global-nav">
      <div class="nav-container">
        <a href="index.html" class="nav-brand-section">
          <img src="logo.jpeg" alt="gAIa Logo" class="nav-logo">
          <span class="nav-brand">gAIa</span>
        </a>
        
        <div class="nav-links">
          <a href="task1.html" class="nav-link" data-page="task1">Task 1</a>
          <a href="task2.html" class="nav-link" data-page="task2">Task 2</a>
          <a href="task3.html" class="nav-link" data-page="task3">Task 3</a>
        </div>
      </div>
    </nav>
  `;
  
  // Insert navigation at the start of body
  document.addEventListener('DOMContentLoaded', function() {
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    // Highlight active page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const links = document.querySelectorAll('#global-nav .nav-link');
    
    links.forEach(link => {
      if (link.getAttribute('data-page') === currentPage) {
        link.classList.add('active');
      }
    });
  });
})();