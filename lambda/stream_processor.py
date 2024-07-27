import os
import json
import boto3
import base64
import traceback
from time import time
from uuid import uuid4
from decimal import Decimal

table_name = "building-temp-transformed"
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)
sns_topic_arn = os.getenv("SNS_TOPIC_ARN")
sns = boto3.client("sns")


def lambda_handler(event, context):
    output = []

    with table.batch_writer() as batch:
        for record in event["records"]:
            # Decode from base64
            decoded_data = base64.b64decode(record["data"]).decode("utf-8")
            payload = json.loads(decoded_data)
            payload["_id_"] = uuid4().hex
            payload["timestamp"] = int(time())

            try:
                if "temperature" in payload:
                    payload["temperature"] = Decimal(str(payload["temperature"]))

                batch.put_item(Item=payload)

                check_anomaly(payload)
            except Exception as e:
                traceback.print_exc()
                pass

            output_record = {
                "recordId": record["recordId"],
                "result": "Ok",
                "data": record["data"],
            }
            output.append(output_record)

    return {"records": output}


def check_anomaly(payload):
    # detect anomalies in temperature and send to sns
    if not "temperature" in payload:
        return

    temperature = payload["temperature"]
    if int(temperature) > 36:
        room_id = payload.get("room_id")
        sensor_id = payload.get("sensor_id")
        if room_id and sensor_id:
            sns.publish(
                TopicArn=sns_topic_arn,
                Message=f"Alert: Temperature in Room {room_id} from Sensor {sensor_id} is {temperature} degrees Celsius.",
                Subject="Temperature Raise Alert",
            )
