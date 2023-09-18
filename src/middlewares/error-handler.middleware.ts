import { NextFunction, Request, Response } from 'express'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  console.error(error)

  return res.sendStatus(500)
}
