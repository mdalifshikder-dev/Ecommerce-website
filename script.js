const filters = document.querySelectorAll(".filter");
const products = document.querySelectorAll(".product-card");
const cart = [];
const cartDrawer = document.getElementById("cartDrawer");
const scrim = document.getElementById("scrim");
const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

filters.forEach((filter) =>
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.toggle("active", item === filter));
    products.forEach((product) => {
      product.hidden =
        filter.dataset.filter !== "all" &&
        product.dataset.category !== filter.dataset.filter;
    });
  }),
);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1700);
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = count;
  drawerCount.textContent = `(${count})`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
  if (!cart.length) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your bag is waiting for something lovely.</p>';
    return;
  }
  cartItems.innerHTML = cart
    .map(
      (item, index) => `
    <div class="cart-item">
      <div><strong>${item.name}</strong><small>Qty: ${item.qty} · $${item.price.toFixed(2)}</small></div>
      <div><strong>$${(item.price * item.qty).toFixed(2)}</strong><br><button data-remove="${index}">Remove</button></div>
    </div>`,
    )
    .join("");
}
function openCart() {
  cartDrawer.classList.add("open");
  scrim.classList.add("show");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  scrim.classList.remove("show");
}

document.querySelectorAll(".quick-add").forEach((button) =>
  button.addEventListener("click", () => {
    const product = button.closest(".product-card");
    const existing = cart.find((item) => item.name === product.dataset.name);
    if (existing) existing.qty += 1;
    else
      cart.push({
        name: product.dataset.name,
        price: Number(product.dataset.price),
        qty: 1,
      });
    renderCart();
    showToast("Added to your bag");
  }),
);
document.getElementById("bagButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);
cartItems.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  if (!remove) return;
  cart.splice(Number(remove.dataset.remove), 1);
  renderCart();
});
document
  .getElementById("checkoutButton")
  .addEventListener("click", () =>
    showToast("Demo checkout — connect your payment provider"),
  );
document
  .getElementById("newsletterForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    document.getElementById("newsletterMessage").textContent =
      "Thank you — you're on the list (demo).";
    event.target.reset();
  });
renderCart();
