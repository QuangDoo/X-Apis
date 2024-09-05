import express from 'express'
import databaseService from '~/services/database.services'
import usersRouter from '~/routes/users.routes'

const app = express()

const port = 4000
// parse application/json sang object
app.use(express.json())

app.use('/users', usersRouter)

databaseService.connect()

//@ts-ignore
app.use((error, req, res, next) => {
  console.error('Error: ', error)
  res.status(500).json({
    message: error.message
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
