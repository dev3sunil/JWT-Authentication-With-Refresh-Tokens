const Joi=require('@hapi/joi');


const authSchema=Joi.object({
    email:Joi.string().email().lowercase().required(),
    password:Joi.string().min(2).required(),
    firstName:Joi.string().min(2),
    user_id:Joi.string().min(2)
    // firstName: { type: String, required: true },
});


module.exports={ authSchema }