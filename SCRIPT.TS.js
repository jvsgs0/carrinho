var Carte = /** @class */ (function () {
    function Carte() {
        this.items = [];
        this.storageKey = "carte";
        this.historyKey = "history";
        this.discountRate = 0;
        this.freteFixo = Math.round(Math.round(this.items.length * 50) / 3);
        var saved = localStorage.getItem(this.storageKey);
        if (saved) {
            this.items = JSON.parse(saved);
        }
        var savedDiscount = localStorage.getItem("discount");
        if (savedDiscount) {
            this.discountRate = parseFloat(savedDiscount);
        }
        this.render();
        this.renderHistory();
    }
    Carte.prototype.save = function () {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        localStorage.setItem("discount", this.discountRate.toString());
    };
    Carte.prototype.add = function (product, quantity) {
        if (quantity === void 0) { quantity = 1; }
        var item = this.items.find(function (i) { return i.product.id === product.id; });
        if (item) {
            item.quantity += quantity;
        }
        else {
            this.items.push({ product: product, quantity: quantity });
        }
        this.save();
        this.render();
    };
    Carte.prototype.update = function (productId, quantity) {
        var item = this.items.find(function (i) { return i.product.id === productId; });
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.remove(productId);
            }
        }
        this.save();
        this.render();
    };
    Carte.prototype.remove = function (productId) {
        this.items = this.items.filter(function (i) { return i.product.id !== productId; });
        this.save();
        this.render();
    };
    Carte.prototype.clear = function () {
        this.items = [];
        this.save();
        this.render();
        alert("Seu carrinho foi limpado com sucesso!");
    };
    Carte.prototype.subtotal = function () {
        return this.items.reduce(function (acc, i) { return acc + i.product.price * i.quantity; }, 0);
    };
    Carte.prototype.shipping = function () {
        return this.items.length > 0 ? this.freteFixo : 0;
    };
    Carte.prototype.discount = function () {
        return this.subtotal() * this.discountRate;
    };
    Carte.prototype.total = function () {
        return this.subtotal() + this.shipping() - this.discount();
    };
    Carte.prototype.applyCoupon = function (code) {
        this.discountRate = (code === "DESCONTO10") ? 0.1 : 0;
        this.save();
        this.render();
    };
    Carte.prototype.checkout = function () {
        if (this.items.length === 0) {
            alert("Carrinho vazio!");
            return;
        }
        var totalCompra = formatMoney(this.total());
        alert("Compra finalizada! Total: ".concat(totalCompra));
        var history = JSON.parse(localStorage.getItem(this.historyKey) || "[]");
        history.push("Compra: ".concat(totalCompra, " em ").concat(new Date().toLocaleString()));
        localStorage.setItem(this.historyKey, JSON.stringify(history));
        this.clear();
        this.renderHistory();
    };
    Carte.prototype.render = function () {
        var _this = this;
        var tbody = document.querySelector("#cart-table tbody");
        tbody.innerHTML = "";
        this.items.forEach(function (item) {
            var tr = document.createElement("tr");
            tr.innerHTML = "\n        <td>".concat(item.product.name, "</td>\n        <td><input type=\"number\" min=\"1\" value=\"").concat(item.quantity, "\" style=\"width:50px\"></td>\n        <td>").concat(formatMoney(item.product.price), "</td>\n        <td>").concat(formatMoney(item.product.price * item.quantity), "</td>\n        <td><button onclick=\"carte.remove(").concat(item.product.id, ")\">X</button></td>\n      ");
            var input = tr.querySelector("input");
            input.addEventListener("change", function () {
                var q = parseInt(input.value) || 1;
                _this.update(item.product.id, q);
            });
            tbody.appendChild(tr);
        });
        document.getElementById("subtotal").textContent = formatMoney(this.subtotal());
        document.getElementById("shipping").textContent = formatMoney(this.shipping());
        document.getElementById("discount").textContent = formatMoney(this.discount());
        document.getElementById("grand").textContent = formatMoney(this.total());
    };
    Carte.prototype.renderHistory = function () {
        var list = document.getElementById("history-list");
        list.innerHTML = "";
        var history = JSON.parse(localStorage.getItem(this.historyKey) || "[]");
        history.forEach(function (i) {
            var li = document.createElement("li");
            li.textContent = i;
            list.appendChild(li);
        });
    };
    return Carte;
}());
function formatMoney(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
var products = [
    { id: 1, name: "Urso de Pelúcia", price: 50 },
    { id: 2, name: "Nintendo Switch 2", price: 2500 },
    { id: 3, name: "Bola de Futebol", price: 120 }
];
var carte = new Carte();
var productsDiv = document.getElementById("products");
products.forEach(function (p) {
    var div = document.createElement("div");
    div.className = "product";
    div.innerHTML = "\n    <h3>".concat(p.name, "</h3>\n    <p>").concat(formatMoney(p.price), "</p>\n    <input type=\"number\" min=\"1\" value=\"1\" id=\"qty-").concat(p.id, "\">\n    <button id=\"add-").concat(p.id, "\">Adicionar</button>\n    <button id=\"wish-").concat(p.id, "\">Desejar</button>\n  ");
    productsDiv.appendChild(div);
    document.getElementById("add-".concat(p.id)).addEventListener("click", function () {
        var qtyInput = document.getElementById("qty-".concat(p.id));
        var qty = parseInt(qtyInput.value) || 1;
        Carte.add(p, qty);
    });
    document.getElementById("wish-".concat(p.id)).addEventListener("click", function () {
        var wishList = document.getElementById("wishlist-items");
        var li = document.createElement("li");
        li.textContent = p.name;
        wishList.appendChild(li);
    });
});
document.getElementById("apply-coupon").addEventListener("click", function () {
    var code = document.getElementById("coupon").value;
    Carte.applyCoupon(code);
});
document.getElementById("login-btn").addEventListener("click", function () {
    var user = document.getElementById("username").value;
    if (user.trim()) {
        localStorage.setItem("user", user);
        document.getElementById("welcome").textContent = "Bem-vindo, ".concat(user, "!");
    }
});
var savedUser = localStorage.getItem("user");
if (savedUser) {
    document.getElementById("welcome").textContent = "Bem-vindo, ".concat(savedUser, "!");
}
var searchInput = document.getElementById("search");
function renderProducts(filter) {
    if (filter === void 0) { filter = ""; }
    productsDiv.innerHTML = "";
    var filtered = products.filter(function (p) { return p.name.toLowerCase().includes(filter.toLowerCase()); });
    filtered.forEach(function (p) {
        var div = document.createElement("div");
        div.className = "product";
        div.innerHTML = "\n      <h3>".concat(p.name, "</h3>\n      <p>").concat(formatMoney(p.price), "</p>\n      <input type=\"number\" min=\"1\" value=\"1\" id=\"qty-").concat(p.id, "\">\n      <button id=\"add-").concat(p.id, "\">Adicionar</button>\n      <button id=\"wish-").concat(p.id, "\">Desejar</button>\n    ");
        productsDiv.appendChild(div);
        document.getElementById("add-".concat(p.id)).addEventListener("click", function () {
            var qtyInput = document.getElementById("qty-".concat(p.id));
            var qty = parseInt(qtyInput.value) || 1;
            Carte.add(p, qty);
        });
        document.getElementById("wish-".concat(p.id)).addEventListener("click", function () {
            var wishList = document.getElementById("wishlist-items");
            var li = document.createElement("li");
            li.textContent = p.name;
            wishList.appendChild(li);
        });
    });
}
renderProducts();
searchInput.addEventListener("input", function () {
    renderProducts(searchInput.value);
});
