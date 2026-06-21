let button = document.querySelector("#buy");
let grid = document.querySelector(".productsGrid");
let closeBtn = document.querySelector("#close");
let cart = document.querySelector(".cart");
let cartNav = document.querySelector(".shopingCart");
let list = document.querySelector(".list");
let cost = document.querySelector(".cost");
let productId, inArr, actEl, act;
const storeItems = new Map([
  [1, { priceInGr: 1200, name: "Zapiekanka" }],
  [2, { priceInGr: 2000, name: "Kebab" }],
  [3, { priceInGr: 900, name: "Lody" }],
])
let sum = 0;
let inCart = [];
grid.addEventListener('click', (e) => {
  if (e.target.classList.contains("addToCart")) {
    cart.style.display = 'block';
    productId = Number(e.target.dataset.product);
    inArr = inCart.findIndex(el => el.id == productId);
    if (inArr == -1) {
      inCart.push({ id: productId, quantity: 1 });
      list.insertAdjacentHTML("afterbegin", `
           <li class="prod" data-product="${productId}">
                <div class="prodLeft">
                <img src="./img/image.png" alt="">
                <div class="info">
                <h3 class="productName">${storeItems.get(productId).name}</h3>
                <span class="price">${(storeItems.get(productId).priceInGr / 100).toFixed(2)} zł</span>
                </div>
                </div>
                <div class="qBox"><input type="number" class="qInp" value="1" min="1" max="99">
                    <span class="material-symbols-rounded icon del">
                        delete
                    </span>
                </div>
            </li>
          `);
      sum += storeItems.get(productId).priceInGr;
      cost.innerText = `${(sum / 100).toFixed(2)} zł`;
    } else {
      ++inCart[inArr].quantity;
      actEl = document.querySelector(`.prod[data-product="${productId}"] input`);
      if (Number(actEl.value) < 100) {
        actEl.value = Number(actEl.value) + 1;
        sum += storeItems.get(productId).priceInGr;
        cost.innerText = `${(sum / 100).toFixed(2)} zł`;

      }
    }
    e.target.toggleAttribute("disabled");
    setTimeout(() => {
      e.target.toggleAttribute("disabled");
    }, 250);
  }
})
button.addEventListener("click", () => {
  fetch("http://localhost:3000/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: inCart
    }),
  })
    .then(res => {
      if (res.ok) return res.json();
      return res.json().then(json => Promise.reject(json));
    })
    .then(({ url }) => {
      window.location = url;
    })
    .catch(e => {
      console.error(e.error);
    })
})
closeBtn.addEventListener('click', (e) => {
  cart.style.display = 'none';
})
cartNav.addEventListener('click', (e) => {
  cart.style.display = 'block';

})
list.addEventListener('change', (e) => {
  if (e.target.classList.contains("qInp")) {
    act = Number(e.target.closest(".prod").dataset.product);
    inArr = inCart.findIndex(el => el.id == act);
    inCart[inArr].quantity = Number(e.target.value);
    actSum()
  }
})
list.addEventListener('click', (e) => {
  if (e.target.classList.contains("del")) {
    act = Number(e.target.closest(".prod").dataset.product);
    inArr = inCart.findIndex(el => el.id == act);
    console.log(inArr)
    inCart.splice(inArr, 1);
    console.log(inCart);
    setTimeout(() => {
      e.target.closest(".prod").remove();
    }, 1000);
    actSum();
  }
})

function actSum() {
  sum = 0;
  for (let i = 0; i < inCart.length; ++i)
    sum += storeItems.get(inCart[i].id).priceInGr * inCart[i].quantity;
  cost.innerText = `${(sum / 100).toFixed(2)} zł`;
}