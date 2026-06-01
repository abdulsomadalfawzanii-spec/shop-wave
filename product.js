let products = [];
let cart = [];

// ELEMENTS
const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");

// FETCH PRODUCTS
fetch("https://dummyjson.com/products?limit=21")
  .then((response) => response.json())
  .then((data) => {
    products = data.products;
    displayProducts(products);
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });

// DISPLAY PRODUCTS
function displayProducts(items) {
  if (!productsContainer) return;

  productsContainer.innerHTML = items
    .map(
      (value) => `
      <div class="card bg-slate-900 rounded-3xl p-4 shadow-lg">

        <div class="relative overflow-hidden rounded-2xl">
          <img
            src="${value.images?.[0] || ""}"
            alt="${value.title}"
            class="w-full h-[250px] object-cover rounded-2xl"
          >

          <div class="overlay"></div>
        </div>

        <div class="mt-5">
          <h2 class="text-2xl font-bold mb-3">${value.title}</h2>

          <div class="space-y-2 text-slate-300">
            <p><span class="text-red-400 font-bold">Brand:</span> ${
              value.brand
            }</p>

            <p><span class="text-red-400 font-bold">Price:</span> $${value.price}</p>

            <p><span class="text-red-400 font-bold">Category:</span> ${
              value.category
            }</p>

            <p><span class="text-red-400 font-bold">Stock:</span> ${
              value.stock || 0
            }</p>

            <p><span class="text-red-400 font-bold">Rating:</span> ${
              value.rating || 0
            }</p>
          </div>

          <button
            onclick="addToCart(${value.id})"
            class="mt-5 w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-bold transition-all duration-300"
          >
            Add To Cart
          </button>
        </div>

      </div>
    `
    )
    .join("");
}
// ADD TO CART
function addToCart(id) {
  let product = products.find(function (item) {
    return item.id === id;
  });

  let existingProduct = cart.find(function (item) {
    return item.id === id;
  });

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCart();
}

// UPDATE CART
function updateCart() {
  const cartContainer = document.getElementById("cartItems");

  const cartCount = document.getElementById("cartCount");

  let totalItems = 0;

  cart.forEach(function (item) {
    totalItems += item.quantity;
  });

  cartCount.innerText = totalItems;

  if (cart.length === 0) {
    cartContainer.innerHTML = `

      <p class="text-slate-400">
        Cart is empty
      </p>

    `;

    return;
  }

  let totalPrice = 0;

  cartContainer.innerHTML =
    cart
      .map(function (item) {
        totalPrice += item.price * item.quantity;

        return `

      <div class="bg-slate-800 p-4 rounded-2xl mb-4">

        <div class="flex items-center gap-4">

          <img
            src="${item.images[0]}"
            class="w-20 h-20 object-cover rounded-xl"
          >

          <div class="flex-1">

            <h2 class="font-bold text-lg">
              ${item.title}
            </h2>

            <p class="text-red-400 font-bold">
              $${item.price}
            </p>

            <div class="flex items-center gap-3 mt-3">

              <!-- MINUS -->
              <button
                onclick="decreaseQuantity(${item.id})"
                class="bg-red-500 px-3 py-1 rounded-lg"
              >
                -
              </button>

              <!-- QUANTITY -->
              <span class="font-bold">
                ${item.quantity}
              </span>

              <!-- PLUS -->
              <button
                onclick="increaseQuantity(${item.id})"
                class="bg-green-500 px-3 py-1 rounded-lg"
              >
                +
              </button>

            </div>

          </div>

          
          <button
            onclick="removeItem(${item.id})"
            class="text-red-500 text-xl"
          >
            <i class="fa-solid fa-trash"></i>
          </button>

        </div>

      </div>

    `;
      })
      .join("") +
    `

    <div class="border-t border-slate-700 pt-5 mt-5">

      <h2 class="text-2xl font-bold">
        Total: $${totalPrice.toFixed(2)}
      </h2>

    </div>

  `;
}

// INCREASE QUANTITY
function increaseQuantity(id) {
  let item = cart.find(function (product) {
    return product.id === id;
  });

  item.quantity += 1;

  updateCart();
}

// DECREASE QUANTITY
function decreaseQuantity(id) {
  let item = cart.find(function (product) {
    return product.id === id;
  });

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter(function (product) {
      return product.id !== id;
    });
  }

  updateCart();
}

// REMOVE ITEM
function removeItem(id) {
  cart = cart.filter(function (product) {
    return product.id !== id;
  });

  updateCart();
}

// TOGGLE CART SIDEBAR
function toggleCart() {
  const sidebar = document.getElementById("cartSidebar");

  if (sidebar.style.right === "0px") {
    sidebar.style.right = "-100%";
  } else {
    sidebar.style.right = "0px";
  }
}

// SEARCH PRODUCTS
searchInput.addEventListener("input", function (e) {
  const searchValue = e.target.value.toLowerCase();

  const filteredProducts = products.filter((item) => {
    return (
      item.title?.toLowerCase().includes(searchValue) ||
      item.brand?.toLowerCase().includes(searchValue) ||
      item.category?.toLowerCase().includes(searchValue)
    );
  });

  displayProducts(filteredProducts);
});

// footer
const footerYear = document.getElementById("footerYear");

if (footerYear) {
  footerYear.innerHTML = `© ${new Date().getFullYear()} XM Store. All Rights Reserved.`;
}

// nav

const menuBtn = document.getElementById("menuBtn");

const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", function () {
  mobileMenu.classList.toggle("hidden");
});
