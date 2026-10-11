/* =========================================================
   THE SOLUTION POINT
   PRODUCT STORE
   ========================================================= */

const PRODUCT_STORAGE_KEY = "tsp_products";
const CART_STORAGE_KEY = "tsp_cart";


/* =========================================================
   ACTUAL PRODUCT CATALOG
   ========================================================= */

const DEFAULT_PRODUCTS = [

    {
        code: "TSP0001",
        category: "Register/Copy",
        name: "Doms A4 Register",
        mrp: 80,
        discount: 20,
        price: 60,
        image: ""
    },

    {
        code: "TSP0002",
        category: "Pen",
        name: "Doms Roller Pen",
        mrp: 10,
        discount: 0,
        price: 10,
        image: ""
    },

    {
        code: "TSP0003",
        category: "Pencil",
        name: "Natraj",
        mrp: 7,
        discount: 0,
        price: 7,
        image: ""
    },

    {
        code: "TSP0004",
        category: "Eraser",
        name: "Natraj",
        mrp: 5,
        discount: 0,
        price: 5,
        image: ""
    },

    {
        code: "TSP0005",
        category: "Shapner",
        name: "Natraj",
        mrp: 5,
        discount: 0,
        price: 5,
        image: ""
    },

    {
        code: "TSP0006",
        category: "Gift Kit",
        name: "Painting Kit",
        mrp: 199,
        discount: 11,
        price: 180,
        image: ""
    },

    {
        code: "TSP0007",
        category: "Kids Items",
        name: "Clay",
        mrp: 80,
        discount: 30,
        price: 50,
        image: ""
    }

];


/* =========================================================
   GET PRODUCTS
   ========================================================= */

function getProducts() {

    const savedProducts =
        localStorage.getItem(PRODUCT_STORAGE_KEY);

    if (!savedProducts) {

        localStorage.setItem(
            PRODUCT_STORAGE_KEY,
            JSON.stringify(DEFAULT_PRODUCTS)
        );

        return [...DEFAULT_PRODUCTS];

    }

    try {

        const products =
            JSON.parse(savedProducts);

        if (
            !Array.isArray(products) ||
            products.length === 0
        ) {

            localStorage.setItem(
                PRODUCT_STORAGE_KEY,
                JSON.stringify(DEFAULT_PRODUCTS)
            );

            return [...DEFAULT_PRODUCTS];

        }

        return products;

    } catch (error) {

        localStorage.setItem(
            PRODUCT_STORAGE_KEY,
            JSON.stringify(DEFAULT_PRODUCTS)
        );

        return [...DEFAULT_PRODUCTS];

    }

}


/* =========================================================
   SAVE PRODUCTS
   ========================================================= */

function saveProducts(products) {

    localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(products)
    );

}


/* =========================================================
   MONEY FORMAT
   ========================================================= */

function formatMoney(amount) {

    return "₹" +
        Number(amount || 0)
            .toLocaleString("en-IN");

}


/* =========================================================
   DISCOUNT PERCENTAGE
   ========================================================= */

function getDiscountPercentage(product) {

    if (
        !product.mrp ||
        product.mrp <= product.price
    ) {

        return 0;

    }

    return Math.round(
        (
            (product.mrp - product.price)
            / product.mrp
        ) * 100
    );

}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        function(character) {

            const entities = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };

            return entities[character];

        }
    );

}


/* =========================================================
   PRODUCT IMAGE
   ========================================================= */

function productImage(product) {

    if (product.image) {

        return `
            <img
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
            >
        `;

    }

    return `
        <div class="product-placeholder">

            <span>
                ${escapeHTML(
                    product.name
                        .charAt(0)
                        .toUpperCase()
                )}
            </span>

        </div>
    `;

}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

    const discountPercentage =
        getDiscountPercentage(product);

    return `
        <article class="product-card">

            <div class="product-image">

                ${productImage(product)}

            </div>


            <div class="product-content">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>


                <h3>
                    ${escapeHTML(product.name)}
                </h3>


                <div class="product-code">
                    Item Code:
                    ${escapeHTML(product.code)}
                </div>


                <div class="product-price">

                    <strong>
                        ${formatMoney(product.price)}
                    </strong>

                    ${
                        product.mrp > product.price
                        ?
                        `
                        <del>
                            ${formatMoney(product.mrp)}
                        </del>
                        `
                        :
                        ""
                    }

                    ${
                        discountPercentage > 0
                        ?
                        `
                        <span class="discount-badge">
                            ${discountPercentage}% OFF
                        </span>
                        `
                        :
                        ""
                    }

                </div>


                <button
                    type="button"
                    class="btn btn-primary add-cart"
                    data-code="${escapeHTML(product.code)}"
                >
                    Add to Cart
                </button>

            </div>

        </article>
    `;

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    const grid =
        document.getElementById("productGrid");

    if (!grid) {
        return;
    }


    const searchInput =
        document.getElementById("productSearch");

    const categorySelect =
        document.getElementById("categoryFilter");


    const search =
        searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";


    const category =
        categorySelect
        ? categorySelect.value
        : "all";


    const products =
        getProducts();


    const filteredProducts =
        products.filter(function(product) {

            const searchText = (

                product.code +
                " " +
                product.name +
                " " +
                product.category

            ).toLowerCase();


            const matchesSearch =
                searchText.includes(search);


            const matchesCategory =
                category === "all" ||
                category === "" ||
                product.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    if (filteredProducts.length === 0) {

        grid.innerHTML = `

            <div class="empty-products">

                <h3>
                    No products found
                </h3>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML =
        filteredProducts
            .map(createProductCard)
            .join("");

}


/* =========================================================
   LOAD CATEGORIES
   ========================================================= */

function loadCategories() {

    const select =
        document.getElementById("categoryFilter");

    if (!select) {
        return;
    }


    select.innerHTML = `

        <option value="all">
            All Categories
        </option>

    `;


    const products =
        getProducts();


    const categories = [
        ...new Set(
            products.map(function(product) {

                return product.category;

            })
        )
    ].sort();


    categories.forEach(function(category) {

        const option =
            document.createElement("option");


        option.value =
            category;


        option.textContent =
            category;


        select.appendChild(option);

    });

}


/* =========================================================
   CART
   ========================================================= */

function getCart() {

    try {

        const cart =
            JSON.parse(
                localStorage.getItem(
                    CART_STORAGE_KEY
                )
            );

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart(cart) {

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================================
   CART COUNT
   ========================================================= */

function getCartCount() {

    const cart =
        getCart();

    return cart.reduce(
        function(total, item) {

            return total +
                (Number(item.quantity) || 0);

        },
        0
    );

}


/* =========================================================
   CREATE MOBILE CART BAR
   ========================================================= */

function createMobileCartBar() {

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
        getCartCount();


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

    } else {

        bar.classList.remove("show");

        document.body.classList.remove(
            "has-mobile-cart-bar"
        );

    }

}


/* =========================================================
   UPDATE CART COUNT
   ========================================================= */

function updateCartCount() {

    const count =
        getCartCount();


    document
        .querySelectorAll(".cart-count")
        .forEach(function(element) {

            element.textContent =
                count;

        });


    updateMobileCartBar();

}


/* =========================================================
   CART ANIMATION
   ========================================================= */

function animateCartCount() {

    document
        .querySelectorAll(".cart-count")
        .forEach(function(element) {

            element.classList.remove("bump");

            void element.offsetWidth;

            element.classList.add("bump");

        });

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(productCode) {

    const products =
        getProducts();


    const product =
        products.find(function(item) {

            return (
                item.code === productCode
            );

        });


    if (!product) {
        return;
    }


    const cart =
        getCart();


    const existingItem =
        cart.find(function(item) {

            return (
                item.code === productCode
            );

        });


    if (existingItem) {

        existingItem.quantity =
            (Number(existingItem.quantity) || 0) + 1;

    } else {

        cart.push({

            code: productCode,

            quantity: 1

        });

    }


    saveCart(cart);

    updateCartCount();

    animateCartCount();

    showToast(
        product.name +
        " added to cart"
    );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    let toast =
        document.getElementById(
            "storeToast"
        );


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id =
            "storeToast";

        toast.className =
            "store-toast";

        document.body.appendChild(toast);

    }


    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(function() {

        toast.classList.remove("show");

    }, 1800);

}


/* =========================================================
   ADD TO CART CLICK
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(".add-cart");


        if (!button) {
            return;
        }


        addToCart(
            button.dataset.code
        );

    }
);


/* =========================================================
   INITIALISE PRODUCT PAGE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        getProducts();

        loadCategories();

        renderProducts();

        createMobileCartBar();

        updateCartCount();


        const searchInput =
            document.getElementById(
                "productSearch"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                renderProducts
            );

        }


        const categorySelect =
            document.getElementById(
                "categoryFilter"
            );


        if (categorySelect) {

            categorySelect.addEventListener(
                "change",
                renderProducts
            );

        }

    }
);


/* =========================================================
   STORAGE CHANGE
   ========================================================= */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key === CART_STORAGE_KEY
        ) {

            updateCartCount();

        }


        if (
            event.key === PRODUCT_STORAGE_KEY
        ) {

            loadCategories();

            renderProducts();

        }

    }
);


/* =========================================================
   SAFETY CHECK
   ========================================================= */

setInterval(function() {

    createMobileCartBar();

    updateCartCount();

}, 500);