const amqplib = require('amqplib');
const exchangeName = "logs";
const msg = process.argv.slice(2).join(' ') || "Hello...";
const publisher = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "fanout", { durable: true });
    channel.publish(exchangeName, "", Buffer.from(msg));
    console.log('Logs are sent to Logging service : ', msg);
    setTimeout(() => {
        connection.close();
        process.exit(0)
    }, 500)
}
publisher();