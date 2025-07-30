import {Hono} from 'hono'
import pino from 'pino'

import {z} from 'zod'
import {zValidator} from '@hono/zod-validator'

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

const contactSchema = z.object({
  phone_number: z.string(),
})

const customerSchema = z.object({
  args: z.object({
    name: z.string(),
    email: z.email(),
    phone_number: z.string(),
    address: z.string(),
    credit_card_number: z.string().optional(),
  })
})

const app = new Hono()

const contacts: Record<string, { name: string, email: string, phone_number: string, address: string }> = {
  '3132511492': {
    name: 'Luis Troya',
    email: 'troyaluis56@gmail.com',
    phone_number: '3132511492',
    address: 'Carrera 100 #148-58, Bogotá, Colombia',
  },
  '123123': {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    phone_number: '123123',
    address: '123 Main St, Springfield, USA',
  }
}

app.get('/', (c) => {
  logger.info('Getting products...')
  // Give me 10 products with name, price, description and stock
  const products = Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (Math.random() * 100).toFixed(2),
    description: `Description for product ${i + 1}`,
    stock: Math.floor(Math.random() * 100) + 1,
  }))
  return c.json({products})
})

app.get('/info', zValidator('query', contactSchema), async (c) => {
  const data = c.req.valid('query')
  const query = await c.req.query()

  logger.info('Received contact information...')
  logger.info({data}, 'Validated data')

  if (!contacts[data.phone_number]) {
    return c.json({
      message: 'Contact not found',
      query,
      data: null,
    }, 404)
  }

  return c.json({
    message: 'Contact found',
    query,
    data: contacts[data.phone_number],
  })
})

app.post('/customer/register', zValidator('json', customerSchema), async (c) => {
  const data = c.req.valid('json')
  const body = await c.req.json()

  logger.info('Received contact information...')
  logger.info({data}, 'Validated data')

  return c.json({
    message: 'Contact registered successfully!',
    body,
    data,
  })
})

app.post('/register', zValidator('json', schema), async (c) => {
  const {args: data} = c.req.valid('json')
  const fullBody = await c.req.json()

  logger.info('Registering user...')
  logger.info({data}, 'Validated data')

  return c.json({
    message: 'User registered successfully!',
    data,
    fullBody,
    method: c.req.method,
    path: c.req.path,
    statusCode: 200,
  })
})

app.get('/customer', async (c) => {
  return c.json({
    data: {
      name: 'Luis',
      age: 32,
      address: 'Carrera 100 #148-58, Bogotá, Colombia',
      email: 'troyaluis56@gmail.com'
    }
  })
})

export default app
