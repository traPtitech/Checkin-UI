import { http, delay, HttpResponse } from 'msw'
import type { GetCheckoutSessionsResponse } from '@/lib/apis/generated/api'
import { mockInvoices } from './invoice'
import { mockCustomers } from './customer'

export const mockCheckoutSessions: GetCheckoutSessionsResponse = {
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

export const listHandlers = [
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
]
