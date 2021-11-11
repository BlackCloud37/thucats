import { Method } from 'axios'
import { Schema } from '../schemas/types'

/**
 * webhook 定义
 */
export interface Webhook {
  _id: string

  name: string

  /**
   * webhook 类型
   */
  type: 'http' | 'function'

  event: string[]

  collections: (Schema & '*')[]

  /**
   * http webhook 属性
   */
  url: string

  method: Method

  headers: { key: string; value: string }[]

  /**
   * function webhook 属性
   */
  functionName: string
}
