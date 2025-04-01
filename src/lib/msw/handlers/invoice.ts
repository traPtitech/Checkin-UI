import { http, delay, HttpResponse } from 'msw'
import type { Invoice, PostInvoiceRequest } from '@/lib/apis/generated/api'
import { mockCustomers } from './customer'

export const mockInvoices: Invoice = {
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

export const invoiceHandlers = [
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
]
