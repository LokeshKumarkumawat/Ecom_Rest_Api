import Joi from "joi"
import product from "../models/product"

const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    size: Joi.string().required(),
    image: Joi.string(),

})

export default productSchema;