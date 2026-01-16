import { Request, Response, NextFunction } from 'express'

export const requestTimer = (req: Request, res: Response, next: NextFunction): void => {
  const startHrTime = process.hrtime()

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startHrTime)
    const executionTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(2) + 'ms'
    res.locals.executionTime = executionTime
  })

  next()
}
