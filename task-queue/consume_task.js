const amqplib = require('amqplib');
const queueName = "task";
const receiveMsg = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true }); // default exchange type is direct
    channel.prefetch(2);
    console.log("Waiting for message in the queue", queueName);
    channel.consume(queueName, msg => {
        const secs = msg.content.toString().split('.').length - 1;
        console.log(" [X]  Reciebved: ", msg.content.toString());
        setTimeout(() => {
            console.log("Processing Task is completed after ", secs, " seconds");
            channel.ack(msg);
        }, secs * 1000);
    }, { noAck: false });
}

receiveMsg();