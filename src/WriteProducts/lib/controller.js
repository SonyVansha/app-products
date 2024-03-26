const { SQSClient, DeleteMessageCommand } = require("/opt/node_modules/@aws-sdk/client-sqs");
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("/opt/node_modules/@aws-sdk/client-apigatewaymanagementapi");
const { buildResponse, randomNumber } = require("/opt/utilities");
const { initDatabase } = require("./connection");
const { eventSchema } = require("./validation");

const apiGateway = new ApiGatewayManagementApiClient({
apiVersion: '2018-11-29',
endpoint: `https://${process.env.WEBSOCKET_ID}.execute-api.us-east-1.amazonaws.com/dev`, // Retrieve the API endpoint from environment variables
});

const getEvent = async () => {
try {
    const { Event } = await initDatabase();
    const res = await Event.findAll();
    return buildResponse(200, "Get event success!", res);
} catch (error) {
    console.error(`Get event error : ${error}`);
    return buildResponse(500, "Get event error!", null);
}
};

const getEventById = async (id) => {
try {
    const { Event } = await initDatabase();
    const eventData = await Event.findByPk(id);

    if (!eventData) {
        return buildResponse(
        404,
        `Event with id ${id} is not found!`
        );
    } else {
        await Event.destroy({ where: { eventId: id } });
        return buildResponse(200, "Remove event success!", null);
    }
} catch (error) {
    console.error(`Remove event error : ${error}`);
    return buildResponse(500, "Remove event error!", null);
}
};

const createEvent = async (rawBody) => {
try {
    await eventSchema.validate(rawBody, { abortEarly: false });
    const { name, price, description } = rawBody;

    const { Event } = await initDatabase();
    const rawData = {
        name,
        price,
        description
    };
    await Event.create(rawData);

    return buildResponse(200, "Event is saved", rawData);
} catch (error) {
    if (
        error.name === "ValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
    ) {
        console.error(`Create event error : ${error.name}`);
        return buildResponse(400, "Validation Error!", error.errors);
    } else {
        console.error(`Create event error : ${error}`);
        return buildResponse(500, "Create event error!", null);
    }
}
};

const updateEventById = async (productId, updatedData) => {
try {
    const { Event } = await initDatabase();
    const eventData = await Event.findByPk(productId);

    if (eventData) {
        // Lakukan pembaruan data event dengan data yang diberikan
        await eventData.update(updatedData);

        return buildResponse(200, "Event updated successfully!", eventData);
    } else {
        return buildResponse(404, "Event not found!", null);
    }
} catch (error) {
    console.error(`Update event by id error: ${error}`);
    return buildResponse(500, "Update event by id error!", null);
}
};


const removeEvent = async (productId) => {
try {
    const { Event } = await initDatabase();
    const eventData = await Event.findByPk(productId);

    if (!eventData) {
        return buildResponse(
        404,
        `products with id ${productId} is not found!`
        );
    } else {
        await Event.destroy({ where: { id: productId } });
        return buildResponse(200, "Remove products success!", null);
    }
} catch (error) {
    console.error(`Remove products error : ${error}`);
    return buildResponse(500, "Remove products error!", null);
}
};


const sendMessage = async (targetId, message) => {
try {
    const params = {
        ConnectionId: targetId,
        Data: JSON.stringify(message),
    };

    const sendCommand = new PostToConnectionCommand(params);
    await apiGateway.send(sendCommand);
} catch (error) {
    console.log(`SendMessage error : ${error}`);
}
};

module.exports = { getEvent, getEventById, createEvent, updateEventById, removeEvent };
