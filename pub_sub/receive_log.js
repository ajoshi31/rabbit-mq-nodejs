const amqplib = require('amqplib');

const exchangeName = "logs";

const consumeLog = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "fanout", { durable: true });
    const queue = await channel.assertQueue('', { exclusive: true });
    console.log("Waiting for message in the queue", queue.queue);
    channel.bindQueue(queue.queue, exchangeName, '');

    channel.consume(queue.queue, msg => {
        if (msg.content) {
            console.log("The message is :", msg.content.toString())
        }
    }, { noAck: true });
}

consumeLog();