let products = [];

let cart = (JSON.parse(localStorage.getItem("cart")) || []).filter(
  (item) =>
    item !== null && item !== undefined && typeof item.quantity === "number",
);

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");

// FETCH PRODUCTS
fetch("https://dummyjson.com/products/category/motorcycle")
  .then((response) => response.json())
  .then(function (data) {
    products = data.products;
    displayProducts(products);
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
    if (productsContainer) {
      productsContainer.innerHTML = `<p class="text-slate-400 text-center col-span-4">Failed to load products. Please try again.</p>`;
    }
  });

// DISPLAY PRODUCTS
function displayProducts(items) {
  if (!productsContainer) return;

  if (items.length === 0) {
    productsContainer.innerHTML = `<p class="text-slate-400 text-center col-span-4">No products found.</p>`;
    return;
  }

  productsContainer.innerHTML = items
    .map(function (value) {
      return `
      <div class="card rounded-3xl p-4">
        <div class="relative overflow-hidden rounded-2xl">
          <img
            src="${value.images?.[0] || ""}"
            class="w-full h-[250px] object-cover rounded-2xl"
          >
          <div class="overlay"></div>
        </div>

        <div class="mt-5">
          <h2 class="text-2xl font-bold mb-3">${value.title}</h2>

          <div class="space-y-2 text-slate-300">
            <p><span class="text-red-400 font-bold">Brand:</span> ${value.brand || "N/A"}</p>
            <p><span class="text-red-400 font-bold">Price:</span> $${value.price}</p>
            <p><span class="text-red-400 font-bold">Rating:</span> ${value.rating}</p>
          </div>

          <button
            onclick="addToCart(${value.id})"
            class="mt-5 w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-bold transition"
          >
            Add To Cart
          </button>
        </div>
      </div>
    `;
    })
    .join("");
}

// ADD TO CART
function addToCart(id) {
  let product = products.find((item) => item.id === id);
  if (!product) return;

  let existingProduct = cart.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCart();
}

// UPDATE CART
function updateCart() {
  const cartContainer = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");

  if (!cartContainer || !cartCount) return;

  let totalItems = 0;
  cart.forEach((item) => {
    if (item && item.quantity) totalItems += item.quantity;
  });

  cartCount.innerText = totalItems;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-slate-400">Cart is empty</p>`;
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
          <img src="${item.images?.[0] || ""}" class="w-20 h-20 object-cover rounded-xl">

          <div class="flex-1">
            <h2 class="font-bold text-lg">${item.title}</h2>
            <p class="text-red-400 font-bold">$${item.price}</p>

            <div class="flex items-center gap-3 mt-3">
              <button onclick="decreaseQuantity(${item.id})" class="bg-red-500 px-3 py-1 rounded-lg">-</button>
              <span class="font-bold">${item.quantity}</span>
              <button onclick="increaseQuantity(${item.id})" class="bg-green-500 px-3 py-1 rounded-lg">+</button>
            </div>
          </div>

          <button onclick="removeItem(${item.id})" class="text-red-500 text-xl">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
      })
      .join("") +
    `
    <div class="border-t border-slate-700 pt-5 mt-5">
      <h2 class="text-2xl font-bold">Total: $${totalPrice.toFixed(2)}</h2>
    </div>
  `;
}

// INCREASE QUANTITY
function increaseQuantity(id) {
  let item = cart.find((product) => product.id === id);
  if (!item) return;
  item.quantity += 1;
  saveCart();
  updateCart();
}

// DECREASE QUANTITY
function decreaseQuantity(id) {
  let item = cart.find((product) => product.id === id);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter((product) => product.id !== id);
  }

  saveCart();
  updateCart();
}

// REMOVE ITEM
function removeItem(id) {
  cart = cart.filter((product) => product.id !== id);
  saveCart();
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

if (searchInput) {
  searchInput.addEventListener("input", function (e) {
    let searchValue = e.target.value.toLowerCase();

    let filteredProducts = products.filter((item) => {
      return (
        item.title?.toLowerCase().includes(searchValue) ||
        item.brand?.toLowerCase().includes(searchValue) ||
        item.category?.toLowerCase().includes(searchValue)
      );
    });

    displayProducts(filteredProducts);
  });
}

// FOOTER YEAR
const footerYear = document.getElementById("footerYear");
if (footerYear) {
  footerYear.innerHTML = `© ${new Date().getFullYear()} XM Store. All Rights Reserved.`;
}

// NAV MOBILE MENU
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCart();
});
