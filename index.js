import express from 'express'

const app = express()
const PORT = 3001

app.get('/', (req, res) => {
  const queries = req.query
  res.status(200).json({
    status: 'success',
    data: 'Hello World!',
    queries // == queries: queries
  })
}) // EXAMPLE ROUTE: http://localhost:3001/?amount=300&price=10

app.get('/generateInvoice', (_req, _res) => {

})

app.get('/convertFromOffice', (_req, _res) => {

})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})