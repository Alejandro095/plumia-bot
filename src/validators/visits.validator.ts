import Joi from "joi";

const visitSchema = Joi.object({
    licensePlate: Joi.string().trim().required(),
    mallId: Joi.number().required(),
})

export default visitSchema;