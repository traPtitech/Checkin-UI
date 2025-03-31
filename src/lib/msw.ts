import { setupWorker } from 'msw/browser'
import { http, delay, HttpResponse } from 'msw'
import type {
  Admin,
  Customer,
  GetCheckoutSessionsResponse,
  Invoice,
  PostCustomerRequest,
  PostInvoiceRequest,
} from './apis/generated/api'

// Mock data
const mockAdmins: Admin[] = [{ id: 'admin1' }, { id: 'admin2' }]

const mockCustomers: Customer[] = [
  { id: 'cus_123', name: 'Test User 1', email: 'test1@example.com', traq_id: 'user1' },
  { id: 'cus_456', name: 'Test User 2', email: 'test2@example.com', traq_id: 'user2' },
]

const mockInvoices: Invoice = {
  has_more: false,
  data: [
    {
      id: 'in_123',
      amount_due: 1000,
      amount_paid: 1000,
      amount_remaining: 0,
      created: 1680644467,
      customer: mockCustomers[0],
      status: 'paid',
      payment_intent: 'pi_123',
      product_id: 'prod_123',
    },
    {
      id: 'in_456',
      amount_due: 2000,
      amount_paid: 0,
      amount_remaining: 2000,
      created: 1680644467,
      customer: mockCustomers[1],
      status: 'open',
      payment_intent: 'pi_456',
      product_id: 'prod_456',
    },
  ],
}

const mockCheckoutSessions: GetCheckoutSessionsResponse = {
  has_more: false,
  data: [
    {
      id: 'cs_123',
      amount_total: 1000,
      amount_subtotal: 1000,
      created: 1679600215,
      customer: mockCustomers[0],
      status: 'complete',
      payment_intent: 'pi_123',
      product_id: 'prod_123',
    },
    {
      id: 'cs_456',
      amount_total: 2000,
      amount_subtotal: 2000,
      created: 1679600215,
      customer: mockCustomers[1],
      status: 'open',
      payment_intent: 'pi_456',
      product_id: 'prod_456',
    },
  ],
}

const handlers = [
  // Customer API
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

  // Invoice API
  http.post('/invoice', async ({ request }) => {
    await delay(500)
    const invoiceData = (await request.json()) as PostInvoiceRequest

    const customer = mockCustomers.find((c) => c.id === invoiceData.customer_id)

    if (!customer) {
      return new HttpResponse(null, { status: 404 })
    }

    const newInvoice = {
      id: `in_${Math.random().toString(36).substring(2, 10)}`,
      amount_due: 1000,
      amount_paid: 0,
      amount_remaining: 1000,
      created: Math.floor(Date.now() / 1000),
      customer,
      status: 'open' as const,
      payment_intent: `pi_${Math.random().toString(36).substring(2, 10)}`,
      product_id: invoiceData.product_id,
    }

    mockInvoices.data?.unshift(newInvoice)

    return HttpResponse.json(mockInvoices, { status: 201 })
  }),

  // Webhook API
  http.post('/webhook/invoice-paid', async ({ request }) => {
    await delay(500)
    const stripeSignature = request.headers.get('Stripe-Signature')

    if (!stripeSignature) {
      return new HttpResponse(null, { status: 403 })
    }

    return new HttpResponse(null, { status: 204 })
  }),

  // List API
  http.get('/list/invoices', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const customerId = url.searchParams.get('customer_id')

    if (customerId) {
      const filteredInvoices = {
        ...mockInvoices,
        data: mockInvoices.data?.filter((invoice) => invoice.customer?.id === customerId),
      }
      return HttpResponse.json(filteredInvoices)
    }

    return HttpResponse.json(mockInvoices)
  }),

  http.get('/list/checkout-sessions', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const customerId = url.searchParams.get('customer_id')

    if (customerId) {
      const filteredSessions = {
        ...mockCheckoutSessions,
        data: mockCheckoutSessions.data?.filter((session) => session.customer?.id === customerId),
      }
      return HttpResponse.json(filteredSessions)
    }

    return HttpResponse.json(mockCheckoutSessions)
  }),

  // Admin API
  http.get('/admin', async () => {
    await delay(500)
    return HttpResponse.json(mockAdmins)
  }),

  http.post('/admin', async ({ request }) => {
    await delay(500)
    const adminData = (await request.json()) as Admin

    if (mockAdmins.some((admin) => admin.id === adminData.id)) {
      return new HttpResponse(null, { status: 409 })
    }

    mockAdmins.push(adminData)

    return HttpResponse.json(adminData, { status: 201 })
  }),

  http.delete('/admin', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return new HttpResponse(null, { status: 400 })
    }

    const index = mockAdmins.findIndex((admin) => admin.id === id)

    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    mockAdmins.splice(index, 1)

    return new HttpResponse(null, { status: 204 })
  }),
].flat()

export const initMock = () => {
  // FIXME: if (process.env.NODE_ENV === 'development')
  const worker = setupWorker(...handlers)
  worker.start({
    onUnhandledRequest: 'bypass',
  })
}
