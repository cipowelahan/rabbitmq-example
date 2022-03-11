const fastify = require('fastify')({ logger: true })

const amqp = require('amqplib').connect('amqp://0.0.0.0:5672')
const channel = 'uwu'

amqp.then(conn => {
    console.log('connect')
    return conn.createChannel().then(ch => {
        console.log('channel')

        return ch.assertQueue(channel).then(ok => {
            console.log('consume message')
            return ch.consume(channel, (msg) => {
                if (msg !== null) {
                    console.log(JSON.parse(msg.content.toString()))
                }
            }, { noAck: true })
        })
    })
}).catch(err => console.log(err))

const start = async () => {
    try {
        await fastify.listen(3001, '0.0.0.0')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()