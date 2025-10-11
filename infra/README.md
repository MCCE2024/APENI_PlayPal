## Limitations
Running from 0 with `tofu apply` will cause this error:

```
╷
│ Error: kafka server: The client is not authorized to access this topic
│
│   with kafka_topic.playpal_topic,
│   on main.tf line 86, in resource "kafka_topic" "playpal_topic":
│   86: resource "kafka_topic" "playpal_topic" {
│
╵
```

To fix this issue you have to create an ACL rule in exoscale for `prod_kafka_user` with `admin` permission on topic `*`.

```
│ Error: kafka: client has run out of available brokers to talk to: dial tcp: lookup playpal-kafka-service-exoscale-2e879ca8-521a-4506-b89f-e88ff80a.g.aivencloud.com: no such host
│
│   with kafka_topic.playpal_topic,
│   on main.tf line 86, in resource "kafka_topic" "playpal_topic":
│   86: resource "kafka_topic" "playpal_topic" {
```

or

```
│ Error: kafka: client has run out of available brokers to talk to: EOF
│
│   with kafka_topic.playpal_topic,
│   on main.tf line 86, in resource "kafka_topic" "playpal_topic":
│   86: resource "kafka_topic" "playpal_topic" {
│
╵
```

This is because the Kafka service takes a few minutes to be fully provisioned and available. To work around this, you can:
 - Run `tofu apply` again after a few minutes.
