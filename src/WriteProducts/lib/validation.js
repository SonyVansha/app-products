const yup = require("/opt/node_modules/yup");

const eventSchema = yup.object().shape({
    name: yup.string().required(),
    // price: yup.number().positive().integer().required(),
    price: yup.string().required(),
    description: yup.string().required()
});


module.exports = { eventSchema };