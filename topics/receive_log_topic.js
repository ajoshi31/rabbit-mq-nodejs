const amqplib = require('amqplib');
const exchangeName = "topic-logs";
const args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: recieve_log_direct.js [info] [warning] [error]");
    process.exit(1);
}


const consumeLog = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "topic", { durable: true });
    const q = await channel.assertQueue('', { exclusive: true });
    console.log("Waiting for message in the queue", q.queue);
    args.forEach(function (severity) {
        channel.bindQueue(q.queue, exchangeName, severity);
    });
    channel.consume(q.queue, msg => {
        if (msg.content) {
            console.log(`Routing Key: ${msg.fields.routingKey}, Message : ${msg.content.toString()}`);
        }
    }, { noAck: true });
}

consumeLog();