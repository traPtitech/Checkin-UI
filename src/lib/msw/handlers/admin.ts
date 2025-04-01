import type { Admin } from '@/lib/apis/generated'
import { delay, http, HttpResponse } from 'msw'

const mockAdmins: Admin[] = [{ id: 'admin1' }, { id: 'admin2' }]

export const adminHandlers = [
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
]
