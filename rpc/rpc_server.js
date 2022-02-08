const amqplib = require('amqplib');
const queueName = "rpc_queue";

function fibonacci(n) {
    return n < 1 ? 0
        : n <= 2 ? 1
            : fibonacci(n - 1) + fibonacci(n - 2)
}

const receiveMsg = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });
    channel.prefetch(1);

    console.log("[x] Awaiting RPC request");

    channel.consume(queueName, msg => {
        const n = parseInt(msg.content.toString());
        const fib = fibonacci(n);
        console.log(`[X]  Fib of  ${n} is ${fib}`);
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(fib.toString()), {
            correlationId: msg.properties.correlationId
        });
        channel.ack(msg);
    }, { noAck: false });
}

receiveMsg();