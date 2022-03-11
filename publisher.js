const fastify = require('fastify')({ logger: true })

const amqp = require('amqplib').connect('amqp://0.0.0.0:5672')
const channel = 'uwu'

fastify.get('/', async (req, res) => {
    amqp.then(conn => {
        console.log('connect')
        return conn.createChannel().then(ch => {
            console.log('channel')
            const message = {
                name: 'metana',
                message: 'torana'
            }

            return ch.assertQueue(channel).then(ok => {
                console.log('send message')
                return ch.sendToQueue(channel, Buffer.from(JSON.stringify(message)))
            })
        })
    }).catch(err => console.log(err))

    return {
        success: true
    }
})

const start = async () => {
    try {
        await fastify.listen(3000, '0.0.0.0')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()