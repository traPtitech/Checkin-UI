import { ref, Ref } from 'vue'
import { apiClient, ApiError } from '@/lib/apis/apiClient'
import type { Customer, PostCustomerRequest } from '@/lib/apis/generated/api'

export function useCustomerApi() {
  const customer: Ref<Customer | null> = ref(null)
  const isLoading = ref(false)
  const error = ref<ApiError | null>(null)

  /**
   * Customerを検索する
   */
  const fetchCustomer = async (params: { 
    customerId?: string; 
    traqId?: string; 
    email?: string 
  }) => {
    isLoading.value = true
    error.value = null
    
    try {
      customer.value = await apiClient.getCustomer(params)
      return customer.value
    } catch (err) {
      error.value = err as ApiError
      customer.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 新しいCustomerを作成する
   */
  const createCustomer = async (customerData: PostCustomerRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      customer.value = await apiClient.createCustomer(customerData)
      return customer.value
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 既存のCustomerを更新する
   */
  const updateCustomer = async (customerData: PostCustomerRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      customer.value = await apiClient.updateCustomer(customerData)
      return customer.value
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    customer,
    isLoading,
    error,
    fetchCustomer,
    createCustomer,
    updateCustomer
  }
}