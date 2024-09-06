import express, { NextFunction, Request, Response } from 'express'
import databaseService from '~/services/database.services'
import usersRouter from '~/routes/users.routes'
import cors from 'cors'
import { defaultErrorHandler } from './middlewares/error.middleware'

databaseService.connect()

const app = express()

const port = 4000

app.use(cors())
// parse application/json sang object
app.use(express.json())

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
