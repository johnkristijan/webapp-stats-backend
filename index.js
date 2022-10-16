const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({
    origin: '*'
}))
app.use(express.json())
const port = 3030

app.get('/', (req, res) => {
  res.send('Server is alive and well!')
})

app.post('/webapp-stats', (req, res) => {
    console.log('API triggered')
    const body = req.body
    console.table(body)
    res.json("OK")
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})