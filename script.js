/* =========================================================
   THE SOLUTION POINT
   MAIN WEBSITE JAVASCRIPT
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuButton && nav) {

    menuButton.addEventListener("click", function () {

        nav.classList.toggle("open");

    });


    nav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            nav.classList.remove("open");

        });

    });

}


/* =========================================================
   CONTACT FORM
========================================================= */

const form = document.getElementById("contactForm");

if (form) {

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const nameElement =
            document.getElementById("name");

        const phoneElement =
            document.getElementById("phone");

        const serviceElement =
            document.getElementById("service");

        const messageElement =
            document.getElementById("message");


        const name =
            nameElement
                ? nameElement.value.trim()
                : "";


        const phone =
            phoneElement
                ? phoneElement.value.trim()
                : "";


        const service =
            serviceElement
                ? serviceElement.value
                : "";


        const message =
            messageElement
                ? messageElement.value.trim()
                : "";


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


/* =========================================================
   CART STORAGE
========================================================= */

const TSP_CART_KEY = "tsp_cart";


function getTspCart() {

    try {

        const savedCart =
            localStorage.getItem(TSP_CART_KEY);


        if (!savedCart) {

            return [];

        }


        const cart =
            JSON.parse(savedCart);


        return Array.isArray(cart)
            ? cart
            : [];

    }
    catch (error) {

        return [];

    }

}


/* =========================================================
   CART ITEM COUNT
========================================================= */

function getCartItemCount() {

    const cart =
        getTspCart();


    return cart.reduce(
        function (total, item) {

            return (
                total +
                (
                    Number(item.quantity) || 1
                )
            );

        },
        0
    );

}


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const count =
        getCartItemCount();


    document
        .querySelectorAll(".cart-count")
        .forEach(function (element) {

            const oldValue =
                Number(element.textContent) || 0;


            element.textContent =
                count;


            if (count !== oldValue) {

                element.classList.remove("bump");


                /*
                   Force browser reflow so
                   the animation can restart.
                */

                void element.offsetWidth;


                element.classList.add("bump");

            }

        });


    updateMobileCartBar();

}


/* =========================================================
   MOBILE CART BAR
========================================================= */

function createMobileCartBar() {

    /*
       Do not create the bar more than once.
    */

    if (
        document.querySelector(
            ".mobile-cart-bar"
        )
    ) {

        return;

    }


    const bar =
        document.createElement("div");


    bar.className =
        "mobile-cart-bar";


    bar.innerHTML = `

        <div class="mobile-cart-info">

            <div class="mobile-cart-icon">
                🛒
            </div>

            <div class="mobile-cart-text">

                <strong>
                    <span id="mobileCartCount">
                        0
                    </span>
                    item(s) in cart
                </strong>

                <span>
                    Ready to checkout
                </span>

            </div>

        </div>


        <a
            href="cart.html"
            class="mobile-cart-button"
        >
            View Cart
        </a>

    `;


    document.body.appendChild(bar);

}


/* =========================================================
   UPDATE MOBILE CART BAR
========================================================= */

function updateMobileCartBar() {

    const bar =
        document.querySelector(
            ".mobile-cart-bar"
        );


    if (!bar) {

        return;

    }


    const count =
        getCartItemCount();


    const countElement =
        document.getElementById(
            "mobileCartCount"
        );


    if (countElement) {

        countElement.textContent =
            count;

    }


    if (count > 0) {

        bar.classList.add("show");

        document.body.classList.add(
            "has-mobile-cart-bar"
        );

    }
    else {

        bar.classList.remove("show");

        document.body.classList.remove(
            "has-mobile-cart-bar"
        );

    }

}


/* =========================================================
   CART STORAGE CHANGE
========================================================= */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === TSP_CART_KEY
        ) {

            updateCartCount();

        }

    }
);


/* =========================================================
   PAGE VISIBILITY
   Refresh cart when user returns to the page.
========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState === "visible"
        ) {

            updateCartCount();

        }

    }
);


/* =========================================================
   INITIALISE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createMobileCartBar();

        updateCartCount();

    }
);