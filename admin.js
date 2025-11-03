
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
const container = document.getElementById("products");
const loader = document.getElementById("loader");


async function getProducts() {
  loader.classList.remove("hidden");
  container.classList.add("hidden");

  const res = await fetch(API_URL);
  let data = await res.json();

 
  data = data.reverse();

  loader.classList.add("hidden");
  container.classList.remove("hidden");

  renderProducts(data);
}


function renderProducts(products) {
  container.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-xl shadow p-4 flex flex-col justify-between";
    card.innerHTML = `
      <img src="${p.img}" alt="${
      p.title
    }" class="w-full h-40 object-contain mb-3">
      <h3 class="font-semibold text-lg">${p.title}</h3>
      <p class="text-blue-600 font-bold">${p.price.toLocaleString()} so‘m</p>
      <div class="flex justify-between mt-3">
        <button class="edit bg-blue-400 text-white px-3 py-1 rounded"><i class="fa-solid fa-pencil"></i></button>
        <button class="delete bg-red-500 text-white px-3 py-1 rounded"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

  
    card.querySelector(".delete").addEventListener("click", async () => {
      if (confirm("Haqiqatan ham o‘chirmoqchimisiz?")) {
        await fetch(`${API_URL}/${p.id}`, { method: "DELETE" });
        getProducts();
      }
    });

 
    card.querySelector(".edit").addEventListener("click", async () => {
      const newTitle = prompt("Yangi nom:", p.title);
      const newPrice = prompt("Yangi narx:", p.price);
      const newImg = prompt("Yangi rasm URL:", p.img);

      if (newTitle && newPrice && newImg) {
        await fetch(`${API_URL}/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTitle,
            price: Number(newPrice),
            img: newImg,
          }),
        });
        getProducts();
      }
    });

    container.appendChild(card);
  });
}


const addForm = document.getElementById("addForm");
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const price = document.getElementById("price").value.trim();
  const img = document.getElementById("img").value.trim();

  if (!title || !price || !img) return alert("Barcha maydonlarni to‘ldiring!");


  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, price: Number(price), img }),
  });

  addForm.reset();
  getProducts(); 
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
