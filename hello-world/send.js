const amqplib = require('amqplib');

const queueName = "hello";

const msg = "Hello World Test";

const sendMsg = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false }); // default exchange type is direct
    channel.sendToQueue(queueName, Buffer.from(msg));
    console.log('sent : ', msg);
    setTimeout(() => {
        connection.close();
        process.exit(0)
    }, 500)
}


sendMsg();