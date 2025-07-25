import { Hono } from 'hono'
import pino from 'pino'

import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

const schema = z.object({
  args: z.object({
    name: z.string(),
    age: z.number()
  })
})

const app = new Hono()

app.get('/', (c) => {
  logger.info('Getting products...')
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

app.post('/register', zValidator('json', schema), async (c) => {
  const {args: data} = c.req.valid('json')
  const fullBody = await c.req.json()

  logger.info('Registering user...')
  logger.info({ data }, 'Validated data')

  return c.json({
    message: 'User registered successfully!',
    data,
    fullBody,
    method: c.req.method,
    path: c.req.path,
    statusCode: 200,
  })
})

export default app
