import 'dotenv/config'
import './env'

import { app } from './app'
import chalk from 'chalk'

const port = process.env.PORT || 3333

app.listen(port, () => {
  console.info('\x1Bc')

  console.info(chalk.cyan(`Server started at port ${port}`))

  if (process.env.NODE_ENV === 'development') {
    console.info(chalk.gray('[DEVELOPMENT MODE]'))
  }
})
