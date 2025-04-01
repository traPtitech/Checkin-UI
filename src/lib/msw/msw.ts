import { customerHandlers } from './handlers/customer'
import { adminHandlers } from './handlers/admin'
import { invoiceHandlers } from './handlers/invoice'
import { listHandlers } from './handlers/list'

const handlers = [adminHandlers, customerHandlers, invoiceHandlers, listHandlers].flat()

export const initMock = async () => {
  if (process.env.NODE_ENV === 'development') {
    const { setupWorker } = await import('msw/browser')
    const worker = setupWorker(...handlers)
    worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}
