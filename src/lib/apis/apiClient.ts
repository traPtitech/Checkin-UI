import axios, { AxiosError } from 'axios'
import { Apis, Configuration } from './generated'
import type {
  Customer,
  GetCheckoutSessionsResponse,
  GetCheckoutSessionsStatusEnum,
  GetInvoicesCollectionMethodEnum,
  GetInvoicesStatusEnum,
  Invoice,
  PostCustomerRequest,
  PostInvoiceRequest,
} from './generated/api'

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
  private apis: Apis

  private constructor() {
    // 環境変数からベースURLを取得、ない場合はデフォルト値を使用
    this.config = new Configuration({
      basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost',
    })

    // 統合APIクラスのインスタンスを作成
    this.apis = new Apis(this.config, undefined, this.axiosInstance)

    // 共通のエラーハンドリングを設定
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleApiError(error),
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
      originalError: error,
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
    const { customerId, traqId, email } = params
    const response = await this.apis.getCustomer(customerId, traqId, email)
    return response.data
  }

  /**
   * 新しいCustomerを作成する
   */
  public async createCustomer(customerData: PostCustomerRequest): Promise<Customer> {
    const response = await this.apis.postCustomer(customerData)
    return response.data
  }

  /**
   * 既存のCustomerを更新する
   */
  public async updateCustomer(customerData: PostCustomerRequest): Promise<Customer> {
    const response = await this.apis.patchCustomer(customerData)
    return response.data
  }

  // --------------------------------
  // Invoice API 関連メソッド
  // --------------------------------

  /**
   * 請求書を作成する
   */
  public async createInvoice(invoiceData: PostInvoiceRequest): Promise<Invoice> {
    const response = await this.apis.postInvoice(invoiceData)
    return response.data
  }

  // --------------------------------
  // List API 関連メソッド
  // --------------------------------

  /**
   * 請求書の一覧を取得する
   */
  public async getInvoices(
    params: {
      customerId?: string
      subscriptionId?: string
      limit?: number
      startingAfter?: string
      endingBefore?: string
      status?: GetInvoicesStatusEnum
      collectionMethod?: GetInvoicesCollectionMethodEnum
    } = {},
  ): Promise<Invoice> {
    const {
      customerId,
      subscriptionId,
      limit,
      startingAfter,
      endingBefore,
      status,
      collectionMethod,
    } = params

    const response = await this.apis.getInvoices(
      customerId,
      subscriptionId,
      limit,
      startingAfter,
      endingBefore,
      status,
      collectionMethod,
    )

    return response.data
  }

  /**
   * オンライン決済ページ由来の入金一覧を取得する
   */
  public async getCheckoutSessions(
    params: {
      customerId?: string
      subscriptionId?: string
      limit?: number
      startingAfter?: string
      endingBefore?: string
      paymentIntentId?: string
      status?: GetCheckoutSessionsStatusEnum
    } = {},
  ): Promise<GetCheckoutSessionsResponse> {
    const {
      customerId,
      subscriptionId,
      limit,
      startingAfter,
      endingBefore,
      paymentIntentId,
      status,
    } = params

    const response = await this.apis.getCheckoutSessions(
      customerId,
      subscriptionId,
      limit,
      startingAfter,
      endingBefore,
      paymentIntentId,
      status,
    )

    return response.data
  }

  // --------------------------------
  // Admin API 関連メソッド
  // --------------------------------

  /**
   * 管理者一覧を取得する
   */
  public async getAdmins() {
    const response = await this.apis.getAdmins()
    return response.data
  }

  /**
   * 管理者を作成する
   */
  public async createAdmin(id: string) {
    const response = await this.apis.postAdmin({ id })
    return response.data
  }

  /**
   * 管理者を削除する
   */
  public async deleteAdmin(id: string) {
    await this.apis.deleteAdmin(id)
    return true
  }
}

// シングルトンインスタンスをエクスポート
export const apiClient = ApiClient.getInstance()
