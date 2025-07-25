import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  // Give me 10 products with name, price, description and stock
  const products = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (Math.random() * 100).toFixed(2),
    description: `Description for product ${i + 1}`,
    stock: Math.floor(Math.random() * 100) + 1,
  }))
  return c.json(products)
})

export default app
