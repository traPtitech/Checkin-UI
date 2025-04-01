import { customerHandlers } from './handlers/customer'
import { adminHandlers } from './handlers/admin'
import { invoiceHandlers } from './handlers/invoice'
import { listHandlers } from './handlers/list'

const handlers = [adminHandlers, customerHandlers, invoiceHandlers, listHandlers].flat()

export const initMock = async () => {
  if (import.meta.env.DEV) {
    const { setupWorker } = await import('msw/browser')
    const worker = setupWorker(...handlers)
    worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}
