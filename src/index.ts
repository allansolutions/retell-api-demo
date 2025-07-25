import { Hono } from 'hono'

import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const schema = z.object({
  name: z.string(),
  age: z.number(),
})

const app = new Hono()

app.get('/', (c) => {
  console.log('Getting products...')
  // Give me 10 products with name, price, description and stock
  const products = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (Math.random() * 100).toFixed(2),
    description: `Description for product ${i + 1}`,
    stock: Math.floor(Math.random() * 100) + 1,
  }))
  return c.json({products})
})

app.post('/register', zValidator('json', schema), (c) => {
  const data = c.req.valid('json')

  console.log('Registering user...')
  console.log('Data:', data)

  return c.json({
    message: 'User registered successfully',
    data
  })
})

export default app
