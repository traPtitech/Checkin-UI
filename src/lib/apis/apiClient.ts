import { Configuration, CustomerApi, InvoiceApi, ListApi, AdminApi } from './generated'
import axios, { AxiosError, AxiosResponse } from 'axios'
import type { 
  Customer, 
  PostCustomerRequest, 
  PostInvoiceRequest, 
  Invoice, 
  InvoiceDataInner,
  GetCheckoutSessionsResponse
} from './generated/api'

// APIレスポンスの型を単純化するためのユーティリティタイプ
type UnwrapAxiosResponse<T> = T extends AxiosResponse<infer U> ? U : T

// APIエラーの型定義
export interface ApiError {
  status?: number
  message: string
  originalError: Error
}

/**
 * APIクライアントのシングルトンクラス
 * すべてのAPIリクエストを統一したインターフェースで提供する
 */
export class ApiClient {
  private static instance: ApiClient
  private config: Configuration
  private axiosInstance = axios.create()
  
  // API インスタンス
  private customerApi: CustomerApi
  private invoiceApi: InvoiceApi
  private listApi: ListApi
  private adminApi: AdminApi

  private constructor() {
    // 環境変数からベースURLを取得、ない場合はデフォルト値を使用
    this.config = new Configuration({
      basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost',
    })
    
    // 各APIクラスのインスタンスを作成
    this.customerApi = new CustomerApi(this.config, undefined, this.axiosInstance)
    this.invoiceApi = new InvoiceApi(this.config, undefined, this.axiosInstance)
    this.listApi = new ListApi(this.config, undefined, this.axiosInstance)
    this.adminApi = new AdminApi(this.config, undefined, this.axiosInstance)
    
    // 共通のエラーハンドリングを設定
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleApiError(error)
    )
  }

  /**
   * ApiClientのシングルトンインスタンスを取得
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  /**
   * API エラーの共通処理
   */
  private handleApiError(error: AxiosError): Promise<never> {
    console.error('API error:', error)
    
    const apiError: ApiError = {
      message: '不明なエラーが発生しました',
      originalError: error
    }
    
    if (error.response) {
      apiError.status = error.response.status
      
      switch (error.response.status) {
        case 401:
          apiError.message = '認証エラーが発生しました'
          break
        case 404:
          apiError.message = 'リソースが見つかりません'
          break
        case 500:
          apiError.message = 'サーバーエラーが発生しました'
          break
      }
    } else if (error.request) {
      apiError.message = 'サーバーからの応答がありませんでした'
    }
    
    return Promise.reject(apiError)
  }

  // --------------------------------
  // Customer API 関連メソッド
  // --------------------------------
  
  /**
   * Customer情報を取得する
   */
  public async getCustomer(params: {
    customerId?: string
    traqId?: string
    email?: string
  }): Promise<Customer> {
    try {
      const { customerId, traqId, email } = params
      const response = await this.customerApi.getCustomer(customerId, traqId, email)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 新しいCustomerを作成する
   */
  public async createCustomer(customerData: PostCustomerRequest): Promise<Customer> {
    try {
      const response = await this.customerApi.postCustomer(customerData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 既存のCustomerを更新する
   */
  public async updateCustomer(customerData: PostCustomerRequest): Promise<Customer> {
    try {
      const response = await this.customerApi.patchCustomer(customerData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // --------------------------------
  // Invoice API 関連メソッド
  // --------------------------------
  
  /**
   * 請求書を作成する
   */
  public async createInvoice(invoiceData: PostInvoiceRequest): Promise<Invoice> {
    try {
      const response = await this.invoiceApi.postInvoice(invoiceData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // --------------------------------
  // List API 関連メソッド
  // --------------------------------
  
  /**
   * 請求書の一覧を取得する
   */
  public async getInvoices(params: {
    customerId?: string
    subscriptionId?: string
    limit?: number
    startingAfter?: string
    endingBefore?: string
    status?: string
    collectionMethod?: string
  } = {}): Promise<Invoice> {
    try {
      const {
        customerId,
        subscriptionId,
        limit,
        startingAfter,
        endingBefore,
        status,
        collectionMethod
      } = params
      
      const response = await this.listApi.getInvoices(
        customerId,
        subscriptionId,
        limit,
        startingAfter,
        endingBefore,
        status as any,
        collectionMethod as any
      )
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * オンライン決済ページ由来の入金一覧を取得する
   */
  public async getCheckoutSessions(params: {
    customerId?: string
    subscriptionId?: string
    limit?: number
    startingAfter?: string
    endingBefore?: string
    paymentIntentId?: string
    status?: string
  } = {}): Promise<GetCheckoutSessionsResponse> {
    try {
      const {
        customerId,
        subscriptionId,
        limit,
        startingAfter,
        endingBefore,
        paymentIntentId,
        status
      } = params
      
      const response = await this.listApi.getCheckoutSessions(
        customerId,
        subscriptionId,
        limit,
        startingAfter,
        endingBefore,
        paymentIntentId,
        status as any
      )
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  // --------------------------------
  // Admin API 関連メソッド
  // --------------------------------
  
  /**
   * 管理者一覧を取得する
   */
  public async getAdmins() {
    try {
      const response = await this.adminApi.getAdmins()
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 管理者を作成する
   */
  public async createAdmin(id: string) {
    try {
      const response = await this.adminApi.postAdmin({ id })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * 管理者を削除する
   */
  public async deleteAdmin(id: string) {
    try {
      await this.adminApi.deleteAdmin(id)
      return true
    } catch (error) {
      throw error
    }
  }
}

// シングルトンインスタンスをエクスポート
export const apiClient = ApiClient.getInstance()