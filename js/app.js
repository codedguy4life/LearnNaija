const navItems = document.querySelectorAll(".nav-item");

const screens = document.querySelectorAll(".app-screen");


navItems.forEach((item) => {

  item.addEventListener("click", function(event) {

    event.preventDefault();


    const targetId =
      this.getAttribute("href").substring(1);


    // Hide all screens

    screens.forEach((screen) => {

      screen.classList.remove("active-screen");

    });


    // Show selected screen

    const targetScreen =
      document.getElementById(targetId);

    if (targetScreen) {

      targetScreen.classList.add("active-screen");

    }


    // Update active navigation

    navItems.forEach((nav) => {

      nav.classList.remove("active");

    });

    this.classList.add("active");


    // Keep URL hash updated

    history.replaceState(
      null,
      "",
      `#${targetId}`
    );

  });

});


// Open the correct screen if URL contains a hash

const initialScreen =
  window.location.hash.substring(1);


if (initialScreen) {

  const target =
    document.getElementById(initialScreen);

  const targetNav =
    document.querySelector(
      `.nav-item[href="#${initialScreen}"]`
    );


  if (target) {

    screens.forEach((screen) => {

      screen.classList.remove(
        "active-screen"
      );

    });

    target.classList.add(
      "active-screen"
    );

  }


  if (targetNav) {

    navItems.forEach((nav) => {

      nav.classList.remove("active");

    });

    targetNav.classList.add("active");

  }

}

/* =========================
   LANGUAGE SELECTION
========================= */

const languageCards =
  document.querySelectorAll(".language-card");


languageCards.forEach((card) => {

  card.addEventListener("click", () => {

    const language =
      card.dataset.language;

    console.log(
      `Selected language: ${language}`
    );

  });

});