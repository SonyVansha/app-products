const { buildResponse } = require("/opt/utilities");
const { createEvent, updateEventById, removeEvent } = require("./lib/controller.js");

module.exports.handler = async (event) => {
try {
    const httpMethod = event?.httpMethod;
    const pathRequest = event?.path?.split("/")[1];

    if (pathRequest != "products") {
        return buildResponse(400, "Bad Request!", null);
    }

    switch (httpMethod) {
        case "POST":
        const body = JSON.parse(event.body);
        return await createEvent(body);
        case "PUT":
        const { productId } = event.pathParameters; // Mengambil productId dari pathParameters
        const updateData = JSON.parse(event.body);
        return await updateEventById(productId, updateData); 
        case "DELETE":
        const eventId = event?.pathParameters?.productId;
        return await removeEvent(eventId);
        default:
        return buildResponse(400, "Bad Request!", null);
    }
} catch (e) {
    console.error(`Got error while writing event : ${e}`);
    return buildResponse(500, "Internal Server Error", null);
}
};
