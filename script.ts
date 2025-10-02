type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

type CartItem = Product & { quantity: number };

type User = {
  name: string;
  email: string;
};

class Cart {
  private items: CartItem[] = [];
  private coupons: string[] = ["DESCONTO10", "PROMO5"];
  private history: CartItem[][] = [];

  add(product: Product, quantity: number = 1) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) existing.quantity += quantity;
    else this.items.push({ ...product, quantity });
    this.render();
  }

  remove(id: number) {
    this.items = this.items.filter(i => i.id !== id);
    this.render();
  }

  clear() {
    this.items = [];
    this.render();
    alert("Carrinho limpo com sucesso!");
  }

  applyCoupon(code: string) {
    if (this.coupons.includes(code)) {
      const discountEl = document.getElementById("discount")!;
      discountEl.textContent = "R$ -10,00";
    } else alert("Cupom inválido!");
  }

  checkout() {
    if (this.items.length === 0) {
      alert("Carrinho vazio!");
      return;
    }
    this.history.push([...this.items]);
    localStorage.setItem("history", JSON.stringify(this.history));
    alert("Compra finalizada com sucesso!");
    this.clear();
    this.renderHistory();
  }

  calculateShipping(subtotal: number): number {
    if (subtotal === 0) return 0;
    if (subtotal < 50) return 20;
    if (subtotal < 100) return 10;
    return 0;
  }

  render() {
    const tbody = document.querySelector("#cart-table tbody")!;
    tbody.innerHTML = "";
    let subtotal = 0;
    this.items.forEach(item => {
      const total = item.price * item.quantity;
      subtotal += total;
      tbody.innerHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>R$ ${item.price.toFixed(2)}</td>
          <td>R$ ${total.toFixed(2)}</td>
          <td><button class="remove-btn" data-id="${item.id}">Remover</button></td>
        </tr>
      `;
    });
    const shipping = this.calculateShipping(subtotal);
    document.getElementById("subtotal")!.textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById("shipping")!.textContent = `R$ ${shipping.toFixed(2)}`;
    document.getElementById("grand")!.textContent = `R$ ${(subtotal + shipping).toFixed(2)}`;

    tbody.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt((btn as HTMLButtonElement).dataset.id!);
        this.remove(id);
      });
    });
  }

  renderHistory() {
    const list = document.getElementById("history-list")!;
    list.innerHTML = "";
    this.history.forEach((order, idx) => {
      const li = document.createElement("li");
      li.textContent = `Pedido ${idx + 1}: ${order.map(i => `${i.name} (${i.quantity})`).join(", ")}`;
      list.appendChild(li);
    });
  }
}

const products: Product[] = [
  { id: 1, name: "Camiseta", price: 49.9, category: "Roupas" },
  { id: 2, name: "Tênis", price: 199.9, category: "Calçados" },
  { id: 3, name: "Relógio", price: 89.9, category: "Acessórios" }
];

const carte = new Cart();

function renderProducts(list: Product[]) {
  const container = document.getElementById("products")!;
  container.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>R$ ${p.price.toFixed(2)}</p>
      <p>${p.category}</p>
      <input type="number" id="qty-${p.id}" value="1" min="1">
      <button id="add-${p.id}">Add</button>
      <button>Desejar</button>
    `;
    container.appendChild(div);

    const addBtn = div.querySelector(`#add-${p.id}`)! as HTMLButtonElement;
    addBtn.addEventListener("click", () => {
      const qty = parseInt((div.querySelector("input") as HTMLInputElement).value);
      carte.add(p, qty);
      const currentItem = (carte as any)["items"].find((i: CartItem) => i.id === p.id);
      addBtn.textContent = `Add (${currentItem?.quantity || 0})`;
    });

    const wishBtn = div.querySelectorAll("button")[1];
    const wishList = document.getElementById("wishlist-items")!;
    wishBtn.addEventListener("click", () => {
      const li = document.createElement("li");
      li.textContent = p.name;
      wishList.appendChild(li);
    });
  });
}

renderProducts(products);

document.getElementById("search")!.addEventListener("input", e => {
  const term = (e.target as HTMLInputElement).value.toLowerCase();
  renderProducts(products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.category.toLowerCase().includes(term) ||
    p.price.toString().includes(term)
  ));
});

document.getElementById("apply-coupon")!.addEventListener("click", () => {
  const code = (document.getElementById("coupon") as HTMLInputElement).value.trim();
  carte.applyCoupon(code);
});

document.getElementById("checkout-btn")!.addEventListener("click", () => carte.checkout());
document.getElementById("clear-btn")!.addEventListener("click", () => carte.clear());

document.getElementById("login-btn")!.addEventListener("click", () => {
  const name = (document.getElementById("username") as HTMLInputElement).value;
  const email = prompt("Digite seu e-mail:") || "";
  localStorage.setItem("user", JSON.stringify({ name, email }));
  document.getElementById("welcome")!.textContent = `Bem-vindo, ${name}!`;
});

const themeBtn = document.createElement("button");
themeBtn.textContent = "Alternar Tema";
document.body.prepend(themeBtn);
themeBtn.addEventListener("click", () => document.body.classList.toggle("dark"));

window.onload = () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) document.getElementById("welcome")!.textContent = `Bem-vindo de volta, ${JSON.parse(savedUser).name}!`;
  const savedHistory = localStorage.getItem("history");
  if (savedHistory) {
    (carte as any)["history"] = JSON.parse(savedHistory);
    carte.renderHistory();
  }
};
