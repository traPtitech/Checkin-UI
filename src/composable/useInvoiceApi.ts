import { apiClient, ApiError } from '@/lib/apis/apiClient'
import type { InvoiceDataInner, PostInvoiceRequest } from '@/lib/apis/generated/api'
import { ref, Ref } from 'vue'

export function useInvoiceApi() {
  const invoices: Ref<InvoiceDataInner[] | null> = ref(null)
  const isLoading = ref(false)
  const error = ref<ApiError | null>(null)

  /**
   * 顧客IDに基づいて請求書の一覧を取得する
   */
  const fetchInvoices = async (
    customerId?: string,
    params: {
      limit?: number
      startingAfter?: string
      endingBefore?: string
      status?: string
    } = {},
  ) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await apiClient.getInvoices({
        customerId,
        ...params,
      })

      invoices.value = result.data || []
      return invoices.value
    } catch (err) {
      error.value = err as ApiError
      invoices.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 新しい請求書を作成する
   */
  const createInvoice = async (invoiceData: PostInvoiceRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await apiClient.createInvoice(invoiceData)
      // 請求書作成後、自動的に一覧を更新
      if (result.data && result.data.length > 0) {
        invoices.value = result.data
      }
      return result
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    createInvoice,
  }
}
