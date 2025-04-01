import { http, delay, HttpResponse } from 'msw'
import type { Customer, PostCustomerRequest } from '@/lib/apis/generated/api'

export const mockCustomers: Customer[] = [
  { id: 'cus_123', name: 'Test User 1', email: 'test1@example.com', traq_id: 'user1' },
  { id: 'cus_456', name: 'Test User 2', email: 'test2@example.com', traq_id: 'user2' },
]

export const customerHandlers = [
  http.get('/customer', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const customerId = url.searchParams.get('customer_id')
    const traqId = url.searchParams.get('traq_id')
    const email = url.searchParams.get('email')

    let customer: Customer | undefined

    if (customerId) {
      customer = mockCustomers.find((c) => c.id === customerId)
    } else if (traqId) {
      customer = mockCustomers.find((c) => c.traq_id === traqId)
    } else if (email) {
      customer = mockCustomers.find((c) => c.email === email)
    }

    if (!customer) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(customer)
  }),

  http.post('/customer', async ({ request }) => {
    await delay(500)
    const customerData = (await request.json()) as PostCustomerRequest

    const newCustomer: Customer = {
      id: `cus_${Math.random().toString(36).substring(2, 10)}`,
      name: customerData.name,
      email: customerData.email,
      traq_id: customerData.traq_id,
    }

    mockCustomers.push(newCustomer)

    return HttpResponse.json(newCustomer, { status: 201 })
  }),

  http.patch('/customer', async ({ request }) => {
    await delay(500)
    const customerData = (await request.json()) as PostCustomerRequest

    const existingCustomerIndex = mockCustomers.findIndex(
      (c) =>
        c.email === customerData.email ||
        (customerData.traq_id && c.traq_id === customerData.traq_id),
    )

    if (existingCustomerIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    mockCustomers[existingCustomerIndex] = {
      ...mockCustomers[existingCustomerIndex],
      ...customerData,
    }

    return HttpResponse.json(mockCustomers[existingCustomerIndex])
  }),
]
