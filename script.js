var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Cart = /** @class */ (function () {
    function Cart() {
        this.items = [];
        this.coupons = ["DESCONTO10", "PROMO5"];
        this.history = [];
    }
    Cart.prototype.add = function (product, quantity) {
        if (quantity === void 0) { quantity = 1; }
        var existing = this.items.find(function (i) { return i.id === product.id; });
        if (existing)
            existing.quantity += quantity;
        else
            this.items.push(__assign(__assign({}, product), { quantity: quantity }));
        this.render();
    };
    Cart.prototype.remove = function (id) {
        this.items = this.items.filter(function (i) { return i.id !== id; });
        this.render();
    };
    Cart.prototype.clear = function () {
        this.items = [];
        this.render();
        alert("Carrinho limpo com sucesso!");
    };
    Cart.prototype.applyCoupon = function (code) {
        if (this.coupons.includes(code)) {
            var discountEl = document.getElementById("discount");
            discountEl.textContent = "R$ -10,00";
        }
        else
            alert("Cupom inválido!");
    };
    Cart.prototype.checkout = function () {
        if (this.items.length === 0) {
            alert("Carrinho vazio!");
            return;
        }
        this.history.push(__spreadArray([], this.items, true));
        localStorage.setItem("history", JSON.stringify(this.history));
        alert("Compra finalizada com sucesso!");
        this.clear();
        this.renderHistory();
    };
    Cart.prototype.calculateShipping = function (subtotal) {
        if (subtotal === 0)
            return 0;
        if (subtotal < 50)
            return 20;
        if (subtotal < 100)
            return 10;
        return 0;
    };
    Cart.prototype.render = function () {
        var _this = this;
        var tbody = document.querySelector("#cart-table tbody");
        tbody.innerHTML = "";
        var subtotal = 0;
        this.items.forEach(function (item) {
            var total = item.price * item.quantity;
            subtotal += total;
            tbody.innerHTML += "\n        <tr>\n          <td>".concat(item.name, "</td>\n          <td>").concat(item.quantity, "</td>\n          <td>R$ ").concat(item.price.toFixed(2), "</td>\n          <td>R$ ").concat(total.toFixed(2), "</td>\n          <td><button class=\"remove-btn\" data-id=\"").concat(item.id, "\">Remover</button></td>\n        </tr>\n      ");
        });
        var shipping = this.calculateShipping(subtotal);
        document.getElementById("subtotal").textContent = "R$ ".concat(subtotal.toFixed(2));
        document.getElementById("shipping").textContent = "R$ ".concat(shipping.toFixed(2));
        document.getElementById("grand").textContent = "R$ ".concat((subtotal + shipping).toFixed(2));
        tbody.querySelectorAll(".remove-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var id = parseInt(btn.dataset.id);
                _this.remove(id);
            });
        });
    };
    Cart.prototype.renderHistory = function () {
        var list = document.getElementById("history-list");
        list.innerHTML = "";
        this.history.forEach(function (order, idx) {
            var li = document.createElement("li");
            li.textContent = "Pedido ".concat(idx + 1, ": ").concat(order.map(function (i) { return "".concat(i.name, " (").concat(i.quantity, ")"); }).join(", "));
            list.appendChild(li);
        });
    };
    return Cart;
}());
var products = [
    { id: 1, name: "Camiseta", price: 49.9, category: "Roupas" },
    { id: 2, name: "Tênis", price: 199.9, category: "Calçados" },
    { id: 3, name: "Relógio", price: 89.9, category: "Acessórios" }
];
var carte = new Cart();
function renderProducts(list) {
    var container = document.getElementById("products");
    container.innerHTML = "";
    list.forEach(function (p) {
        var div = document.createElement("div");
        div.className = "product";
        div.innerHTML = "\n      <h3>".concat(p.name, "</h3>\n      <p>R$ ").concat(p.price.toFixed(2), "</p>\n      <p>").concat(p.category, "</p>\n      <input type=\"number\" id=\"qty-").concat(p.id, "\" value=\"1\" min=\"1\">\n      <button id=\"add-").concat(p.id, "\">Add</button>\n      <button>Desejar</button>\n    ");
        container.appendChild(div);
        var addBtn = div.querySelector("#add-".concat(p.id));
        addBtn.addEventListener("click", function () {
            var qty = parseInt(div.querySelector("input").value);
            carte.add(p, qty);
            var currentItem = carte["items"].find(function (i) { return i.id === p.id; });
            addBtn.textContent = "Add (".concat((currentItem === null || currentItem === void 0 ? void 0 : currentItem.quantity) || 0, ")");
        });
        var wishBtn = div.querySelectorAll("button")[1];
        var wishList = document.getElementById("wishlist-items");
        wishBtn.addEventListener("click", function () {
            var li = document.createElement("li");
            li.textContent = p.name;
            wishList.appendChild(li);
        });
    });
}
renderProducts(products);
document.getElementById("search").addEventListener("input", function (e) {
    var term = e.target.value.toLowerCase();
    renderProducts(products.filter(function (p) {
        return p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            p.price.toString().includes(term);
    }));
});
document.getElementById("apply-coupon").addEventListener("click", function () {
    var code = document.getElementById("coupon").value.trim();
    carte.applyCoupon(code);
});
document.getElementById("checkout-btn").addEventListener("click", function () { return carte.checkout(); });
document.getElementById("clear-btn").addEventListener("click", function () { return carte.clear(); });
document.getElementById("login-btn").addEventListener("click", function () {
    var name = document.getElementById("username").value;
    var email = prompt("Digite seu e-mail:") || "";
    localStorage.setItem("user", JSON.stringify({ name: name, email: email }));
    document.getElementById("welcome").textContent = "Bem-vindo, ".concat(name, "!");
});
var themeBtn = document.createElement("button");
themeBtn.textContent = "Alternar Tema";
document.body.prepend(themeBtn);
themeBtn.addEventListener("click", function () { return document.body.classList.toggle("dark"); });
window.onload = function () {
    var savedUser = localStorage.getItem("user");
    if (savedUser)
        document.getElementById("welcome").textContent = "Bem-vindo de volta, ".concat(JSON.parse(savedUser).name, "!");
    var savedHistory = localStorage.getItem("history");
    if (savedHistory) {
        carte["history"] = JSON.parse(savedHistory);
        carte.renderHistory();
    }
};
