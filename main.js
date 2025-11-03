

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
const popularContainer = document.getElementById("popular");
const bestContainer = document.getElementById("bestsellers");
const loader = document.getElementById("loader");
const content = document.getElementById("content");
const cartCount = document.getElementById("cartCount");
const likeCount = document.getElementById("likeCount");


let likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];


window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("opacity-0", "transition", "duration-700");
      setTimeout(() => loader.style.display = "none", 700); 
    }
  });
  


likeCount.textContent = likedItems.length;
cartCount.textContent = cartItems.length;


async function getProducts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    displayProducts(data);
  } catch (err) {
    console.error("Xatolik:", err);
  } finally {
    loader.classList.add("hidden");
    content.classList.remove("hidden");
  }
}


function displayProducts(products) {
  products
    .slice(0, 7)
    .forEach((product) => renderProduct(product, popularContainer));
  products.slice(7).forEach((product) => renderProduct(product, bestContainer));
}


function renderProduct(product, container) {
  const card = document.createElement("div");
  card.className =
    "bg-white p-3 rounded-2xl shadow hover:shadow-lg transition flex flex-col relative";

  card.innerHTML = `
    <!-- Like yuqori o‘ngda -->
    <button class="like-btn absolute top-3 right-3 text-gray-400 text-2xl hover:text-red-500 transition">
      <i class="ph ph-heart"></i>
    </button>

    <!-- Rasm -->
    <img src="${product.img}" alt="${
    product.title
  }" class="w-40 h-40 object-contain mx-auto mb-2">

    <!-- Title -->
    <h3 class="text-sm font-medium">${product.title}</h3>

    <!-- Narx -->
    <p class="text-blue-600 font-semibold text-lg my-3">${product.price.toLocaleString()} сум</p>

    <!-- Cart pastki o‘ngda -->
    <button class="cart-btn absolute bottom-3 right-3 text-gray-400 hover:text-blue-500 transition border w-[40px] h-[40px] rounded-full border-solid border-[#ddd] flex items-center justify-center">
      <img src="./img/cart.png" alt="cart" class="w-5 h-5">
    </button>
  `;

  const likeBtn = card.querySelector(".like-btn");
  const cartBtn = card.querySelector(".cart-btn");


  if (likedItems.includes(product.id)) {
    likeBtn.classList.add("text-red-500");
  }

  
  if (cartItems.includes(product.id)) {
    cartBtn.classList.add("bg-blue-500", "text-white");
  }

  
  likeBtn.addEventListener("click", () => {
    if (!likedItems.includes(product.id)) {
      likedItems.push(product.id);
      likeBtn.classList.add("text-red-500");
    } else {
      likedItems = likedItems.filter((id) => id !== product.id);
      likeBtn.classList.remove("text-red-500");
    }
    
    localStorage.setItem("likedItems", JSON.stringify(likedItems));
    likeCount.textContent = likedItems.length;
  });


  cartBtn.addEventListener("click", () => {
    if (!cartItems.includes(product.id)) {
      cartItems.push(product.id);
      cartBtn.classList.add("bg-blue-500", "text-white");
    } else {
      cartItems = cartItems.filter((id) => id !== product.id);
      cartBtn.classList.remove("bg-blue-500", "text-white");
    }
    
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    cartCount.textContent = cartItems.length;
  });

  container.appendChild(card);
}

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
