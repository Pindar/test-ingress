var coap = require('coap'),
    server = coap.createServer(),
    kafka = require('kafka-node'),
    HighLevelProducer = kafka.HighLevelProducer,
    kafkaEndpoint = process.env.KAFKA_ENDPOINT || 'kafka:2181',
    client = new kafka.Client(kafkaEndpoint),
    producer = new HighLevelProducer(client);

server.on('request', function(req, res) {
  var topic = req.url.split('/')[1],
    payloads = [
      { topic: topic, messages: req.payload}
    ];

  if (req.method !== 'POST') {
    res.end('only post allowed\n');
    return;
  }

  // write to kafka
  producer.send(payloads, function (err, data) {
    if (!err) {
      console.log(err);
    }

    console.log(data, topic);
  });

  res.end('written to kafka at ' + kafkaEndpoint + ', topic ' + topic + '\n');
});

// the default CoAP port is 5683
producer.on('ready', function () {
  producer.createTopics(['temperature'], false, function (err, data) {
    console.log('Topic temperature created');
    console.log(data);
  });

  console.log('kafka connection established');

  server.listen(function() {
    console.log('start CoAP');

  });
});
