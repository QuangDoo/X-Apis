import { RequestOptions } from 'http'

import express from 'express'

const app = express()
const port = 3000

app.get('/', (req: RequestOptions, res: any) => {
  res.send('Hello World, Hi!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
