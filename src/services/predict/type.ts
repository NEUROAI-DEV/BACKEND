export interface IPredictionItem {
  timestamp: number
  datetime: string
  predicted_price: number
  change_amount?: number
  change_percent?: number
}

export interface IPredictionResult {
  symbol: string
  icon: string
  interval: string
  last_price?: number
  change_percent?: number
  predictions: IPredictionItem[]
}

export interface IPredictApiResultRow {
  symbol: string
  interval: string
  last_price?: number
  change_percent?: number
  predictions: IPredictionItem[]
}

export interface IPredictApiResponse {
  results: IPredictApiResultRow[]
}
