import 'express-async-errors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type ZodError } from 'zod'

import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import { vercelBuildPayload } from './contracts/http/vercel-build-payload'
import { BuildInfo } from './types/BuildInfo'
import { vercelBuildPayloadMapper } from './contracts/http/mapper'
import chalk from 'chalk'
import { currentSendBuildInfoService } from './infra/send-build-info'
import { errorHandler } from './middlewares/error-handler.middleware'

const app = express()

app.use(express.json())
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'))

app.post('/', async (req, res) => {
  let buildInfo: BuildInfo

  try {
    const vercelPayload = vercelBuildPayload.parse(req.body)

    buildInfo = vercelBuildPayloadMapper.mapToBuildInfo(vercelPayload)
  } catch (error: ZodError | Error | unknown) {
    console.warn(chalk.yellow(`Anomaly detected in vercel payload`))
    console.warn(chalk.yellow(error))

    return res
      .status(400)
      .send(error instanceof Error ? error.message : String(error))
  }

  console.info(chalk.gray('\nSending payload to service'))
  console.info('Build Info:')
  console.info(JSON.stringify(buildInfo, null, 2))

  await currentSendBuildInfoService.send(buildInfo)

  return res.sendStatus(200)
})

app.use(errorHandler)

export { app }
