/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */

import { z } from 'zod'

const envVariablesSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number(),
  SLACK_OAUTH_USER_TOKEN: z.string(),
  SLACK_CHANNEL_NAME: z.string(),
})

const envParsed = envVariablesSchema.parse(process.env)

// @ts-ignore
process.env = envParsed

declare global {
  namespace NodeJS {
    // @ts-ignore
    interface ProcessEnv extends z.infer<typeof envVariablesSchema> {}
  }
}
