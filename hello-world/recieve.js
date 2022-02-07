const amqplib = require('amqplib');
const queueName = "hello";
const receiveMsg = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false }); // default exchange type is direct
    console.log("Waiting for message in the queue", queueName);
    channel.consume(queueName, msg => {
        console.log(" [X]  Reciebved: ", msg.content.toString);
    }, { noAck: true }); c
}

receiveMsg();