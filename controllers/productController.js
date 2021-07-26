import multer from 'multer'
import path from 'path'
import CustomErrorHandler from '../services/CustomErrorHandler';
import productSchema from './productSchema';
import { Product } from '../models'
import fs from 'fs'




const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)

    }
})


const hendelMultipart = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single('image')

const productController = {

    async store(req, res, next) {

        hendelMultipart(req, res, async (err) => {

            if (err) {
                return next(CustomErrorHandler.serverProblem('Server Error'))
            }

            let filePath;
            if (req.file) {
                filePath = req.file.path
            }




            const { error } = productSchema.validate(req.body)

            if (error) {

                // Delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorHandler.serverProblem(err.message));
                    }
                });
                return next(error)

            }

            const { name, price, size } = req.body


            let doc;

            try {

                doc = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                })


            } catch (error) {
                return next(error)
            }


            res.json(doc)




        })

    },

    async update(req, res, next) {
        hendelMultipart(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverProblem('Server Error'))
            }

            let filePath;
            if (req.file) {
                filePath = req.file.path
            }

            const { error } = productSchema.validate(req.body)
            if (error) {

                //delete file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorHandler.serverProblem('Server Error'))
                    }
                })


                return next(error)
            }


            const { name, price, size } = req.body

            let document;

            try {

                document = await Product.findOneAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath })

                }, { new: true })

            } catch (error) {
                return next(error)
            }


            res.status(201).json(document)





        })
    },

    async destroy(req, res, next) {



        const document = await Product.findOneAndRemove({ _id: req.params.id })
        if (!document) {
            return next(new Error("Not Deleted"))
        }



        const imagePath = document._doc.image



        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverProblem('Server Error'))
            }

        })



        res.json(document)
    },

    async index(req, res, next) {
        let document;
        try {

            document = await Product.find().select(' -updatedAt -__v ').sort({_id:-1})
        } catch (error) {
            return next(CustomErrorHandler.serverProblem('Server Error'))
            
        }
        res.json(document)
    },
    async show(req, res, next) {
        let document;
        try {

            document = await Product.find({ _id: req.params.id}).select(' -updatedAt -__v ')
        } catch (error) {
            return next(CustomErrorHandler.serverProblem('Server Error'))
            
        }
        res.json(document)
    }



}


export default productController;