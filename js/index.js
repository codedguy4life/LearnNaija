const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = !mobileMenu.hidden;
    mobileMenu.hidden = isOpen;
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.innerHTML = `<i class="bi bi-${isOpen ? "list" : "x-lg"}"></i>`;
  });

  mobileMenu.addEventListener("click", () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = '<i class="bi bi-list"></i>';
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
