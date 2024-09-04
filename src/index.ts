import express from 'express'
import databaseService from '~/services/database.services'
import usersRouter from '~/routes/users.routes'

const app = express()

const port = 3000
// parse application/json sang object
app.use(express.json())

app.use('/users', usersRouter)

databaseService.connect()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
