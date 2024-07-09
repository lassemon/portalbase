import { Visibility } from '../enums/Visibility'

export interface Entity {
  id: string
  visibility: Visibility
  createdBy: string
  createdAt: number
  updatedAt?: number
}
