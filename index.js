import pdftron from '@pdftron/pdfnet-node'
import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import dotenv from 'dotenv'

dotenv.config()
// process.loadEnvFile() // <-- NEW from Node 21.7.0 (👋👋 Goodbye Dotenv dependency 😯)

const app = express()
const PORT = 3001
const { PDFNet } = pdftron

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

app.get('/convertFromOffice', (req, res) => {
  const { filename } = req.query
  const inputPath = path.resolve(import.meta.dirname, `./input_files/${filename}`)
  const fileNameWithoutExtension = filename.replace(/\.[^/.]+$/, "")
  const outputPath = path.resolve(import.meta.dirname, `./output_files/${fileNameWithoutExtension}.pdf`)

  const convertDocxToPDF = async () => {
    try {
      const pdfDoc = await PDFNet.PDFDoc.create()
      await pdfDoc.initSecurityHandler()
      await PDFNet.Convert.toPdf(pdfDoc, inputPath)
  
      pdfDoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized)
      console.log("PDF conversion successful")
    } catch (error) {
      console.error("Error during PDF conversion:", error)
      throw error
    }
  };

  PDFNet.runWithCleanup(convertDocxToPDF, process.env.licenseKey).then(() => {
    fs.readFile(outputPath, (err, data) => {

      if(err) {
        throw err
      } else {
        res.setHeader('ContentType', 'application/pdf')
        res.end(data)
      }

    })
  }).catch(error => {
    res.status(500).send('Error 500:', error)
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})