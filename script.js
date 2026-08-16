// =========================================
// DOM ELEMENTS
// =========================================

const root = document.documentElement;

const themeToggle =
    document.getElementById("themeToggle");

const mobileThemeToggle =
    document.getElementById("mobileThemeToggle");

const cartButton =
    document.getElementById("cartButton");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCartButton =
    document.getElementById("closeCart");

const cartItemsContainer =
    document.getElementById("cartItems");

const cartCountElement =
    document.getElementById("cartCount");

const cartTotalElement =
    document.getElementById("cartTotal");

const cartItemLabel =
    document.getElementById("cartItemLabel");

const continueShopping =
    document.getElementById("continueShopping");

const filterButtons =
    document.querySelectorAll(".filter-button");

const productCards =
    document.querySelectorAll(".product-card");

const visibleProductCount =
    document.getElementById("visibleProductCount");

const toast =
    document.getElementById("toast");

const menuButton =
    document.getElementById("menuButton");

const mobileNav =
    document.getElementById("mobileNav");

const closeMenu =
    document.getElementById("closeMenu");

const newsletterForm =
    document.getElementById("newsletterForm");


// =========================================
// THEME
// =========================================

function getInitialTheme() {

    const savedTheme =
        localStorage.getItem(
            "velora-theme"
        );


    if (
        savedTheme === "light" ||
        savedTheme === "dark"
    ) {

        return savedTheme;

    }


    const prefersDark =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;


    return prefersDark
        ? "dark"
        : "light";

}


function setTheme(theme) {

    root.setAttribute(
        "data-theme",
        theme
    );


    localStorage.setItem(
        "velora-theme",
        theme
    );


    const label =
        theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode";


    themeToggle.setAttribute(
        "aria-label",
        label
    );


    themeToggle.setAttribute(
        "title",
        label
    );


    if (mobileThemeToggle) {

        mobileThemeToggle.firstChild.textContent =
            theme === "dark"
                ? "Light mode "
                : "Dark mode ";

    }

}


function toggleTheme() {

    const currentTheme =
        root.getAttribute(
            "data-theme"
        );


    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";


    setTheme(newTheme);

}


setTheme(
    getInitialTheme()
);


themeToggle.addEventListener(
    "click",
    toggleTheme
);


if (mobileThemeToggle) {

    mobileThemeToggle.addEventListener(
        "click",
        toggleTheme
    );

}


// =========================================
// CART DATA
// =========================================

let cart = [];


// =========================================
// BODY SCROLL CONTROL
// =========================================

function lockBody() {

    document.body.classList.add(
        "no-scroll"
    );

}


function unlockBody() {

    document.body.classList.remove(
        "no-scroll"
    );

}


// =========================================
// OPEN CART
// =========================================

function openCart() {

    cartDrawer.classList.add(
        "active"
    );

    cartOverlay.classList.add(
        "active"
    );

    lockBody();

}


// =========================================
// CLOSE CART
// =========================================

function closeCart() {

    cartDrawer.classList.remove(
        "active"
    );

    cartOverlay.classList.remove(
        "active"
    );


    if (
        !mobileNav.classList.contains(
            "active"
        )
    ) {

        unlockBody();

    }

}


// =========================================
// CART EVENT LISTENERS
// =========================================

cartButton.addEventListener(
    "click",
    openCart
);


closeCartButton.addEventListener(
    "click",
    closeCart
);


cartOverlay.addEventListener(
    "click",
    closeCart
);


if (continueShopping) {

    continueShopping.addEventListener(
        "click",
        closeCart
    );

}


// =========================================
// ADD PRODUCT TO CART
// =========================================

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".add-button"
            );


        if (!button) return;


        const productCard =
            button.closest(
                ".product-card"
            );


        const name =
            productCard.dataset.name;

        const price =
            Number(
                productCard.dataset.price
            );


        const existingProduct =
            cart.find(
                (item) =>
                    item.name === name
            );


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({

                name: name,

                price: price,

                quantity: 1

            });

        }


        animateCartCounter();

        updateCart();

        showToast(
            `${name} added to your bag`
        );

    }
);


// =========================================
// CART COUNTER ANIMATION
// =========================================

function animateCartCounter() {

    cartCountElement.animate(

        [
            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(1.35)"
            },

            {
                transform:
                    "scale(1)"
            }
        ],

        {
            duration: 350,

            easing:
                "cubic-bezier(.16, 1, .3, 1)"
        }

    );

}


// =========================================
// UPDATE CART
// =========================================

function updateCart() {

    const totalQuantity =
        cart.reduce(

            (total, item) =>
                total +
                item.quantity,

            0

        );


    const totalPrice =
        cart.reduce(

            (total, item) =>
                total +
                (
                    item.price *
                    item.quantity
                ),

            0

        );


    cartCountElement.textContent =
        totalQuantity;


    cartItemLabel.textContent =
        `${totalQuantity} ${
            totalQuantity === 1
                ? "item"
                : "items"
        }`;


    cartTotalElement.textContent =
        `€${totalPrice}`;


    // =====================================
    // EMPTY CART
    // =====================================

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `

            <div class="empty-cart">

                <p>
                    Your bag is currently empty.
                </p>

                <a
                    href="#shop"
                    id="emptyContinue"
                >
                    Explore fragrances
                </a>

            </div>

        `;


        const emptyContinue =
            document.getElementById(
                "emptyContinue"
            );


        emptyContinue.addEventListener(
            "click",
            closeCart
        );


        return;

    }


    const emptyState =
        cartItemsContainer.querySelector(
            ".empty-cart"
        );

    if (emptyState) emptyState.remove();


    // =====================================
    // REMOVE PRODUCTS NO LONGER IN THE CART
    // =====================================

    const currentNames =
        new Set(
            cart.map(
                (item) => item.name
            )
        );


    cartItemsContainer
        .querySelectorAll(
            ".cart-product"
        )
        .forEach(
            (node) => {

                if (
                    currentNames.has(
                        node.dataset.name
                    )
                ) {

                    return;

                }


                // Already animating out from a
                // previous updateCart() call.
                if (
                    node.dataset.removing ===
                    "true"
                ) {

                    return;

                }

                node.dataset.removing =
                    "true";


                const removal =
                    node.animate(

                        [
                            {
                                opacity: 1,
                                transform:
                                    "translateX(0)"
                            },

                            {
                                opacity: 0,
                                transform:
                                    "translateX(15px)"
                            }
                        ],

                        {
                            duration: 250,

                            easing: "ease",

                            fill: "forwards"
                        }

                    );


                removal.onfinish =
                    () => node.remove();

            }
        );


    // =====================================
    // UPDATE EXISTING / INSERT NEW PRODUCTS
    // =====================================
    // Existing rows are updated in place so
    // the entrance animation only plays for
    // genuinely new items, not on every
    // quantity change.

    cart.forEach(
        (item) => {

            const existing =
                Array.from(
                    cartItemsContainer.children
                ).find(
                    (node) =>
                        node.dataset.name ===
                        item.name
                );


            if (existing) {

                existing.querySelector(
                    ".quantity-value"
                ).textContent =
                    item.quantity;


                existing.querySelector(
                    ".cart-product-price"
                ).textContent =
                    `€${
                        item.price *
                        item.quantity
                    }`;


                return;

            }


            const cartProduct =
                document.createElement(
                    "div"
                );


            cartProduct.classList.add(
                "cart-product"
            );

            cartProduct.dataset.name =
                item.name;


            cartProduct.innerHTML = `

                <div
                    class="cart-product-image"
                >
                    VELORA
                </div>


                <div
                    class="cart-product-details"
                >

                    <h4>
                        ${item.name}
                    </h4>


                    <span>
                        Eau de Parfum · 50ml
                    </span>


                    <div
                        class="quantity-controls"
                    >

                        <button
                            class="decrease"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>


                        <span
                            class="quantity-value"
                        >
                            ${item.quantity}
                        </span>


                        <button
                            class="increase"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>

                </div>


                <span
                    class="cart-product-price"
                >
                    €${
                        item.price *
                        item.quantity
                    }
                </span>

            `;


            cartItemsContainer.appendChild(
                cartProduct
            );

        }
    );

}


// =========================================
// CART QUANTITY BUTTONS (delegated)
// =========================================

cartItemsContainer.addEventListener(
    "click",
    (event) => {

        const increaseButton =
            event.target.closest(
                ".increase"
            );

        const decreaseButton =
            event.target.closest(
                ".decrease"
            );

        const button =
            increaseButton ||
            decreaseButton;


        if (!button) return;


        const name =
            button.closest(
                ".cart-product"
            ).dataset.name;

        const item =
            cart.find(
                (product) =>
                    product.name === name
            );


        if (!item) return;


        if (increaseButton) {

            item.quantity++;

        } else {

            item.quantity--;


            if (item.quantity <= 0) {

                cart =
                    cart.filter(
                        (product) =>
                            product.name !== name
                    );

            }

        }


        updateCart();

    }
);


// =========================================
// PRODUCT FILTERS
// =========================================

filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    (filterButton) => {

                        filterButton
                            .classList
                            .remove(
                                "active"
                            );

                    }
                );


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter;


                let count = 0;


                productCards.forEach(
                    (product) => {

                        const category =
                            product.dataset
                                .category;


                        const shouldShow =
                            filter === "all" ||
                            category === filter;


                        if (shouldShow) {

                            const wasHidden =
                                product.classList
                                    .contains(
                                        "hidden"
                                    );


                            product.classList
                                .remove(
                                    "hidden"
                                );

                            // Settle the scroll-reveal state so
                            // cards the IntersectionObserver
                            // hasn't reached yet don't fade back
                            // out once the animation below ends.
                            product.classList
                                .add(
                                    "visible"
                                );


                            count++;


                            if (wasHidden) {

                                product.animate(

                                    [
                                        {
                                            opacity: 0,

                                            transform:
                                                "translateY(20px)"
                                        },

                                        {
                                            opacity: 1,

                                            transform:
                                                "translateY(0)"
                                        }
                                    ],

                                    {
                                        duration: 450,

                                        easing:
                                            "cubic-bezier(.16, 1, .3, 1)"
                                    }

                                );

                            }

                        } else {

                            product.classList
                                .add(
                                    "hidden"
                                );

                        }

                    }
                );


                visibleProductCount
                    .textContent =
                    count;

            }
        );

    }
);


// =========================================
// TOAST
// =========================================

let toastTimer;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "active"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "active"
                );

            },

            2200
        );

}


// =========================================
// MOBILE MENU
// =========================================

function openMobileMenu() {

    mobileNav.classList.add(
        "active"
    );

    lockBody();

}


function closeMobileMenu() {

    mobileNav.classList.remove(
        "active"
    );


    if (
        !cartDrawer.classList.contains(
            "active"
        )
    ) {

        unlockBody();

    }

}


menuButton.addEventListener(
    "click",
    openMobileMenu
);


closeMenu.addEventListener(
    "click",
    closeMobileMenu
);


document
    .querySelectorAll(
        ".mobile-nav nav a"
    )
    .forEach(
        (link) => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        }
    );


// =========================================
// NEWSLETTER
// =========================================

newsletterForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const input =
            newsletterForm.querySelector(
                "input"
            );


        showToast(
            "Thank you for joining VELORA"
        );


        input.value = "";

    }
);


// =========================================
// SCROLL REVEAL
// =========================================

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const revealObserver =
    new IntersectionObserver(

        (entries, observer) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList
                            .add(
                                "visible"
                            );


                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },

        {
            threshold: 0.12,

            rootMargin:
                "0px 0px -40px 0px"
        }

    );


revealElements.forEach(
    (element) => {

        revealObserver.observe(
            element
        );

    }
);


// =========================================
// SUBTLE HERO PARALLAX
// =========================================

const heroArt =
    document.querySelector(
        ".hero-art"
    );


const heroBottle =
    document.querySelector(
        ".hero-bottle"
    );


const heroCircle =
    document.querySelector(
        ".hero-circle"
    );


const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (
    heroArt &&
    !reducedMotion &&
    window.innerWidth > 800
) {

    let heroRect =
        heroArt.getBoundingClientRect();

    let pendingX = 0;
    let pendingY = 0;
    let parallaxFrame = null;


    function applyParallax() {

        heroBottle.style
            .translate =
            `${pendingX * 10}px ${pendingY * 8}px`;


        heroCircle.style
            .translate =
            `${pendingX * -15}px ${pendingY * -12}px`;


        parallaxFrame = null;

    }


    heroArt.addEventListener(
        "mouseenter",
        () => {

            // Refresh the cached rect in case the
            // page scrolled or resized since the
            // last hover.
            heroRect =
                heroArt.getBoundingClientRect();

        }
    );


    heroArt.addEventListener(
        "mousemove",
        (event) => {

            pendingX =
                (
                    event.clientX -
                    heroRect.left
                ) /
                heroRect.width -
                0.5;


            pendingY =
                (
                    event.clientY -
                    heroRect.top
                ) /
                heroRect.height -
                0.5;


            if (parallaxFrame === null) {

                parallaxFrame =
                    requestAnimationFrame(
                        applyParallax
                    );

            }

        }
    );


    heroArt.addEventListener(
        "mouseleave",
        () => {

            if (parallaxFrame !== null) {

                cancelAnimationFrame(
                    parallaxFrame
                );

                parallaxFrame = null;

            }


            heroBottle.style
                .translate =
                "0 0";


            heroCircle.style
                .translate =
                "0 0";

        }
    );

}


// =========================================
// HEADER HIDE / SHOW ON SCROLL
// =========================================

const header =
    document.querySelector(
        ".header"
    );


let previousScrollY =
    window.scrollY;

let headerScrollTicking =
    false;


function updateHeaderOnScroll() {

    const currentScrollY =
        window.scrollY;


    if (
        currentScrollY >
        previousScrollY &&
        currentScrollY > 150
    ) {

        header.style.transform =
            "translateY(-100%)";

    } else {

        header.style.transform =
            "translateY(0)";

    }


    previousScrollY =
        currentScrollY;

    headerScrollTicking =
        false;

}


window.addEventListener(
    "scroll",
    () => {

        if (headerScrollTicking) return;


        headerScrollTicking = true;

        requestAnimationFrame(
            updateHeaderOnScroll
        );

    },

    {
        passive: true
    }
);


// =========================================
// ESCAPE KEY
// =========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        closeCart();

        closeMobileMenu();

    }
);


// =========================================
// INITIALIZE CART
// =========================================

updateCart();