require("dotenv").config()
const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'view')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
})
app.get('/cancel', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'cancel.html'));
})
app.get('success', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'success.html'));
})
app.post('/post', (req, res) => {
    console.log(req.body);
    res.redirect('/');
})
const storeItems = new Map([
  [1, { priceInGr: 1200, name: "Zapiekanka" }],
  [2, { priceInGr: 2000, name: "Kebab" }],
  [3, { priceInGr: 900, name: "Lody" }],
])

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "pln",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInGr,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(PORT, (err) => {
    if(err) console.error(err);
    console.log("Serwer nasluchuje na porcie: ", PORT);
})
