

function updateCounts() {
  const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const likeCounters = document.querySelectorAll("#likeCount");
  const cartCounters = document.querySelectorAll("#cartCount");

  likeCounters.forEach((el) => (el.textContent = likedItems.length));
  cartCounters.forEach((el) => (el.textContent = cartItems.length));
}


updateCounts();


window.addEventListener("storage", updateCounts);

const API_URL = "https://68fb44ef94ec9606602561ae.mockapi.io/api/zon";
const cartContainer = document.getElementById("cartContainer");
const totalPriceEl = document.getElementById("totalPrice");
const clearCartBtn = document.getElementById("clearCart");
const likeCount = document.getElementById("likeCount");
const cartCount = document.getElementById("cartCount");

let likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

likeCount.textContent = likedItems.length;
cartCount.textContent = cartItems.length;

async function getProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();
  const filtered = products.filter((p) => cartItems.includes(p.id));
  renderCart(filtered);
}

function renderCart(products) {
  cartContainer.innerHTML = "";

  if (products.length === 0) {
    cartContainer.innerHTML = `<p class="text-center text-gray-500 text-lg">Savat bo‘sh</p>`;
    totalPriceEl.textContent = 0;
    return;
  }

  let total = 0;

  products.forEach((product) => {
    let quantity = 1;

    const item = document.createElement("div");
    item.className =
      "bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4";

    item.innerHTML = `
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <img src="${product.img}" class="w-20 h-20 object-contain" alt="${
      product.title
    }">
        <div>
          <h3 class="font-semibold text-gray-800">${product.title}</h3>
          <p class="text-blue-600 font-bold">${product.price.toLocaleString()} so‘m</p>
          <p class="text-sm text-gray-500 mt-1">Tovar narxi: <span class="itemTotal text-blue-700 font-semibold">${product.price.toLocaleString()}</span> so‘m</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="decrease bg-gray-200 w-8 h-8 rounded-lg hover:bg-gray-300">−</button>
        <span class="quantity text-lg font-semibold w-6 text-center">${quantity}</span>
        <button class="increase bg-gray-200 w-8 h-8 rounded-lg hover:bg-gray-300">+</button>
        <button class="delete ml-3 text-red-500 hover:text-red-600 text-xl">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    const increaseBtn = item.querySelector(".increase");
    const decreaseBtn = item.querySelector(".decrease");
    const deleteBtn = item.querySelector(".delete");
    const quantityEl = item.querySelector(".quantity");
    const itemTotalEl = item.querySelector(".itemTotal");

    const updateItemTotal = () => {
      const subtotal = product.price * quantity;
      itemTotalEl.textContent = subtotal.toLocaleString();
      updateTotal();
    };

    const updateTotal = () => {
      const allTotals = document.querySelectorAll(".itemTotal");
      total = Array.from(allTotals).reduce(
        (sum, el) => sum + parseInt(el.textContent.replace(/\s/g, "")),
        0
      );
      totalPriceEl.textContent = total.toLocaleString();
    };


    increaseBtn.addEventListener("click", () => {
      quantity++;
      quantityEl.textContent = quantity;
      updateItemTotal();
    });


    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityEl.textContent = quantity;
        updateItemTotal();
      } else {
    
        cartItems = cartItems.filter((id) => id !== product.id);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        item.remove();
        cartCount.textContent = cartItems.length;
        updateTotal();
        if (cartItems.length === 0) {
          cartContainer.innerHTML = `<p class="text-center text-gray-500 text-lg">Savat bo‘sh</p>`;
        }
      }
    });

  
    deleteBtn.addEventListener("click", () => {
      cartItems = cartItems.filter((id) => id !== product.id);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      item.remove();
      cartCount.textContent = cartItems.length;
      updateTotal();
      if (cartItems.length === 0) {
        cartContainer.innerHTML = `<p class="text-center text-gray-500 text-lg">Savat bo‘sh</p>`;
      }
    });

    cartContainer.appendChild(item);
    total += product.price;
  });

  totalPriceEl.textContent = total.toLocaleString();
}


clearCartBtn.addEventListener("click", () => {
  cartItems = [];
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  renderCart([]);
  cartCount.textContent = 0;
});

getProducts();


const searchInput = document.querySelector('input[type="search"]');
const searchButton = document.querySelector("button");


searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    performSearch();
  }
});


searchButton.addEventListener("click", () => {
  performSearch();
});

async function performSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  try {
    const res = await fetch(
      "https://68fb44ef94ec9606602561ae.mockapi.io/api/zon"
    );
    const data = await res.json();


    const filtered = data.filter((product) =>
      product.title.toLowerCase().includes(query)
    );

  
    const container =
      document.getElementById("popular") ||
      document.getElementById("bestsellers");
    container.innerHTML = "";

    if (filtered.length === 0) {
      container.innerHTML = `<p class="text-center text-gray-500 text-lg mt-10">Hech narsa topilmadi</p>`;
    } else {
      filtered.forEach((product) => renderProduct(product, container));
    }
  } catch (err) {
    console.error("Qidiruvda xatolik:", err);
  }
}
