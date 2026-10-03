/* =========================================================
   THE SOLUTION POINT
   PRODUCT STORE
   ========================================================= */

const PRODUCT_STORAGE_KEY = "tsp_products";
const CART_STORAGE_KEY = "tsp_cart";


/* =========================================================
   YOUR INITIAL PRODUCT CATALOG
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

        return JSON.parse(savedProducts);

    } catch (error) {

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

    return "₹" + Number(amount).toLocaleString("en-IN");
}


/* =========================================================
   CALCULATE DISCOUNT %
   ========================================================= */

function getDiscountPercentage(product) {

    if (
        !product.mrp ||
        product.mrp <= product.price
    ) {
        return 0;
    }

    return Math.round(
        ((product.mrp - product.price) / product.mrp) * 100
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
                    product.name.charAt(0).toUpperCase()
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
                        `<del>
                            ${formatMoney(product.mrp)}
                        </del>`
                        :
                        ""
                    }


                    ${
                        discountPercentage > 0
                        ?
                        `<span class="discount-badge">
                            ${discountPercentage}% OFF
                        </span>`
                        :
                        ""
                    }

                </div>


                <button
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
   CART
   ========================================================= */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY)
        ) || [];

    } catch {

        return [];
    }
}


function saveCart(cart) {

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );
}


function getCartCount() {

    const cart = getCart();

    return cart.reduce(
        function(total, item) {

            return total + item.quantity;

        },
        0
    );
}


function updateCartCount() {

    document
        .querySelectorAll(".cart-count")
        .forEach(function(element) {

            element.textContent =
                getCartCount();

        });
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(productCode) {

    const products = getProducts();

    const product = products.find(
        function(item) {

            return item.code === productCode;

        }
    );

    if (!product) {

        return;
    }


    const cart = getCart();


    const existingItem = cart.find(
        function(item) {

            return item.code === productCode;

        }
    );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            code: productCode,

            quantity: 1

        });
    }


    saveCart(cart);

    updateCartCount();

    showToast(
        product.name + " added to cart"
    );
}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showToast(message) {

    let toast =
        document.getElementById("storeToast");


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "storeToast";

        toast.className =
            "store-toast";

        document.body.appendChild(toast);
    }


    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(function() {

        toast.classList.remove("show");

    }, 1800);
}


/* =========================================================
   ADD TO CART BUTTON
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


updateCartCount();