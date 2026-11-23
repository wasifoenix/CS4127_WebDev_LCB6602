/* 

   Part 1: Dark mode button
   Part 2: Menu button for phones
   Part 3: Picture slideshow (home page)
   Part 4: "Show on map" buttons (attractions page)
   Part 5: Checking the contact form (contact page)
    */

/*PART 1: DARK MODE BUTTON*/
var themeButton = document.getElementById('theme-toggle');

// If the visitor chose dark mode last time, turn it on again.
// localStorage lets the browser remember things between pages.
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// Change the words on the button to match the theme.
function updateThemeButton() {
  if (document.body.classList.contains('dark-mode')) {
    themeButton.textContent = '☀️ Light mode';
  } else {
    themeButton.textContent = '🌙 Dark mode';
  }
}

updateThemeButton();

// When the button is clicked, switch the theme and remember it.
themeButton.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }

  updateThemeButton();
});


/*PART 2: MENU BUTTON FOR PHONES ---------- */
var menuButton = document.getElementById('menu-toggle');
var mainNav = document.getElementById('main-nav');

menuButton.addEventListener('click', function () {
  // Show the menu if it is hidden, or hide it if it is showing.
  mainNav.classList.toggle('open');

  // Tell screen readers if the menu is open or closed.
  if (mainNav.classList.contains('open')) {
    menuButton.setAttribute('aria-expanded', 'true');
  } else {
    menuButton.setAttribute('aria-expanded', 'false');
  }
});


/*PART 3: PICTURE SLIDESHOW (home page only) Every slide has the class "slide". The slide we can see also has the class "active". */
var slides = document.querySelectorAll('.slide');
var prevButton = document.getElementById('prev-slide');
var nextButton = document.getElementById('next-slide');
var currentSlide = 0;   // 0 means the first slide

// Hide all the slides, then show the one we want.
function showSlide(number) {
  // After the last slide, go back to the first.
  if (number >= slides.length) {
    number = 0;
  }

  // Before the first slide, go to the last.
  if (number < 0) {
    number = slides.length - 1;
  }

  for (var i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active');
  }

  slides[number].classList.add('active');
  currentSlide = number;
}

// Only run this on the home page, where the buttons exist.
if (prevButton && nextButton) {

  prevButton.addEventListener('click', function () {
    showSlide(currentSlide - 1);
  });

  nextButton.addEventListener('click', function () {
    showSlide(currentSlide + 1);
  });

  // The left and right arrow keys also change the slide.
  var sliderBox = document.querySelector('.slider');

  sliderBox.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      showSlide(currentSlide + 1);
    }
    if (event.key === 'ArrowLeft') {
      showSlide(currentSlide - 1);
    }
  });
}


/* PART 4: "SHOW ON MAP" BUTTONS (attractions page only) Each button's aria-controls holds the id of its map box */
var mapButtons = document.querySelectorAll('.map-button');

for (var m = 0; m < mapButtons.length; m++) {
  mapButtons[m].addEventListener('click', function () {
    var button = this;   // the button that was clicked
    var mapBox = document.getElementById(button.getAttribute('aria-controls'));

    // Show the map if it is hidden, or hide it if it is showing.
    mapBox.classList.toggle('open');

    if (mapBox.classList.contains('open')) {
      button.textContent = '📍 Hide map';
      button.setAttribute('aria-expanded', 'true');
    } else {
      button.textContent = '📍 Show on map';
      button.setAttribute('aria-expanded', 'false');
    }
  });
}


/*PART 5: CHECKING THE CONTACT FORM (contact page only)*/
var contactForm = document.getElementById('contact-form');

// Show or clear the red message under one box.
// Gives back true if the box is OK, false if it is not.
function checkField(input, isOk, errorText) {
  var errorBox = document.getElementById(input.id + '-error');

  if (isOk) {
    errorBox.textContent = '';
    input.setAttribute('aria-invalid', 'false');
    return true;
  } else {
    errorBox.textContent = errorText;
    input.setAttribute('aria-invalid', 'true');
    return false;
  }
}

if (contactForm) {
  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var topicInput = document.getElementById('topic');
  var messageInput = document.getElementById('message');
  var successBox = document.getElementById('form-success');

  contactForm.addEventListener('submit', function (event) {
    // Stop the page from sending the form straight away.
    event.preventDefault();

    // Hide the old "thank you" message.
    successBox.classList.remove('show');

    // Read what the visitor typed. trim() removes extra spaces.
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var topic = topicInput.value;
    var message = messageInput.value.trim();

    // A simple email check: it needs an @, then a dot, with text around them.
    var atPosition = email.indexOf('@');
    var dotPosition = email.lastIndexOf('.');
    var emailOkay = atPosition > 0 && dotPosition > atPosition + 1 && dotPosition < email.length - 1;

    // Check every box, so all the errors show at once.
    var nameOk = checkField(nameInput, name.length >= 2,
      'Please enter your name (at least 2 letters).');
    var emailOk = checkField(emailInput, emailOkay,
      'Please enter a valid email address, like name@example.com.');
    var topicOk = checkField(topicInput, topic !== '',
      'Please choose a topic.');
    var messageOk = checkField(messageInput, message.length >= 10,
      'Please write a message of at least 10 characters.');

    if (nameOk && emailOk && topicOk && messageOk) {
      // Everything is OK: say thank you and clear the form.
      successBox.classList.add('show');
      successBox.focus();
      contactForm.reset();
    } else if (!nameOk) {
      // Move the cursor to the first box with a problem.
      nameInput.focus();
    } else if (!emailOk) {
      emailInput.focus();
    } else if (!topicOk) {
      topicInput.focus();
    } else {
      messageInput.focus();
    }
  });
}
