'use strict';
// Own imports
const amqp = require('amqplib/callback_api');
// Node imports
const { Item } = require('../../models');
const { jimpConfig } = require('../../utils');

/**
 * Connect to rabbitmq
 */
amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            var queue = 'hello';
            channel.assertQueue(queue, {
                durable: false
            });
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            channel.consume(queue, (msg) => {
                // Generate thumbnail
                jimpConfig(item.photo, (thumbnail) => {
                    // Update model
                    item.thumbnail = thumbnail;
                    item.save();
                });
                console.log(" [x] Received %s", msg.content.toString());
            }, {
                noAck: true
            });
        });
    }
);