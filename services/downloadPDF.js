import express from 'express'
import { pipeline } from 'stream'
import { getProducts } from '../library/fs-tools.js'
import { getPDFReadableStream, encodeImage } from '../library/pdf-tools.js'

const downloadPDFRouter = express.Router({ mergeParams: true })

downloadPDFRouter.get('/downloadPDF', async (req, res, next) => {
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        const encodedImage = await encodeImage(selectedProduct.imageUrl)
        console.log(encodedImage)
        res.setHeader("Content-Disposition", `attachment; filename=${ selectedProduct.name }.pdf`)
        const source = getPDFReadableStream(selectedProduct, encodedImage)
        const destination = res
        pipeline(source, destination, error => {
            if (error) next(error)
        })
    } catch (error) {
        next(error)
    }
})

export default downloadPDFRouter