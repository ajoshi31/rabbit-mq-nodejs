const amqplib = require('amqplib');

const exchangeName = "header-logs";
const args = process.argv.slice(2);
const msg = args[1] || "Subscribe , Like, Comment";

console.log(args, msg);
const publisher = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "headers", { durable: true });
    channel.publish(exchangeName, '', Buffer.from(msg), { headers: { account: 'new', method: 'google' } });
    console.log('Logs are sent to Logging service : ', msg);
    setTimeout(() => {
        connection.close();
        process.exit(0)
    }, 500);
}
publisher();