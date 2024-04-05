import Joi from "joi";

const availableSchema = Joi.object({
    mallId: Joi.string().trim().required()
})

export default availableSchema;