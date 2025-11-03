

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
const likeContainer = document.getElementById("likeContainer");
const likeCount = document.getElementById("likeCount");
const cartCount = document.getElementById("cartCount");

let likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];


likeCount.textContent = likedItems.length;
cartCount.textContent = cartItems.length;

async function getLikedProducts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

   
    const likedProducts = data.filter((item) => likedItems.includes(item.id));
    renderLikedProducts(likedProducts);
  } catch (err) {
    console.error("Xatolik:", err);
  }
}

function renderLikedProducts(products) {
  likeContainer.innerHTML = "";

  if (products.length === 0) {
    likeContainer.innerHTML = `<p class="text-center col-span-full text-gray-500 text-lg mt-20">Siz yoqtirgan tovarlar yo‘q</p>`;
    likeCount.textContent = 0;
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-xl shadow text-center relative";

    card.innerHTML = `
      <button class="like-btn absolute top-2 right-2 text-red-500 text-2xl hover:text-gray-400 transition"><i class="ph ph-heart"></i></button>
      <img src="${product.img}" alt="${
      product.title
    }" class="w-36 h-36 object-contain mx-auto mb-2 mt-4">
      <h3 class="font-semibold text-sm">${product.title}</h3>
      <p class="text-blue-600 font-bold mt-1">${product.price.toLocaleString()} so'm</p>
    `;

  
    card.querySelector(".like-btn").addEventListener("click", () => {
      likedItems = likedItems.filter((id) => id !== product.id);
      localStorage.setItem("likedItems", JSON.stringify(likedItems));
      card.remove();
      likeCount.textContent = likedItems.length;

      if (likedItems.length === 0) {
        likeContainer.innerHTML = `<p class="text-center col-span-full text-gray-500 text-lg mt-20">Siz yoqtirgan tovarlar yo‘q</p>`;
      }
    });

    likeContainer.appendChild(card);
  });
}

getLikedProducts();
