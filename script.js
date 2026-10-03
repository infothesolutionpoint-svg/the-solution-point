const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");


// MOBILE MENU

if (menuButton && nav) {

  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
  });


  nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });

  });

}


// CONTACT FORM

const form = document.getElementById("contactForm");

if (form) {

  form.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
      document.getElementById("name").value.trim();

    const phone =
      document.getElementById("phone").value.trim();

    const service =
      document.getElementById("service").value;

    const message =
      document.getElementById("message").value.trim();


    const subject =
      encodeURIComponent(
        "Website Enquiry - The Solution Point"
      );


    const body =
      encodeURIComponent(
        `Name: ${name}
Phone: ${phone}
Service: ${service}

Message:
${message}`
      );


    window.location.href =
      `mailto:info.thesolutionpoint@gmail.com?subject=${subject}&body=${body}`;

  });

}