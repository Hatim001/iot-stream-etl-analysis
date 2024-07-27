import json
import time
import boto3
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("building-temp-transformed")


class DecimalEncoder(json.JSONEncoder):
    """Helper class to convert a DynamoDB item to JSON."""

    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


def prepare_response(status, message, headers={}, **kwargs):
    """prepares the response"""
    response = {
        "statusCode": status,
        "body": json.dumps({"message": message, **kwargs}, cls=DecimalEncoder),
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            **headers,
        },
    }
    return response


def lambda_handler(event, context):
    last_24_hours_start = int(time.time() - 86400)
    last_24_hours_end = int(time.time())

    response = table.scan(
        FilterExpression="#ts >= :start and #ts < :end",
        ExpressionAttributeNames={"#ts": "timestamp"},
        ExpressionAttributeValues={
            ":start": last_24_hours_start,
            ":end": last_24_hours_end,
        },
    )

    items = response["Items"]

    if len(items) == 0:
        return {
            "total_records_last_24_hours": 0,
            "avg_battery_level_last_24_hours": None,
            "avg_humidity_last_24_hours": None,
            "avg_temperature_last_24_hours": None,
            "avg_signal_strength_last_24_hours": None,
            "min_battery_level_last_24_hours": None,
            "max_battery_level_last_24_hours": None,
            "min_humidity_last_24_hours": None,
            "max_humidity_last_24_hours": None,
            "min_temperature_last_24_hours": None,
            "max_temperature_last_24_hours": None,
            "min_signal_strength_last_24_hours": None,
            "max_signal_strength_last_24_hours": None,
        }

    total_records_last_24_hours = len(items)

    avg_battery_level_last_24_hours = (
        sum(item["battery_level"] for item in items) / total_records_last_24_hours
    )
    avg_humidity_last_24_hours = (
        sum(item["humidity"] for item in items) / total_records_last_24_hours
    )
    avg_temperature_last_24_hours = (
        sum(item["temperature"] for item in items) / total_records_last_24_hours
    )
    avg_signal_strength_last_24_hours = (
        sum(item["signal_strength"] for item in items) / total_records_last_24_hours
    )

    min_battery_level_last_24_hours = min(item["battery_level"] for item in items)
    max_battery_level_last_24_hours = max(item["battery_level"] for item in items)
    min_humidity_last_24_hours = min(item["humidity"] for item in items)
    max_humidity_last_24_hours = max(item["humidity"] for item in items)
    min_temperature_last_24_hours = min(item["temperature"] for item in items)
    max_temperature_last_24_hours = max(item["temperature"] for item in items)
    min_signal_strength_last_24_hours = min(item["signal_strength"] for item in items)
    max_signal_strength_last_24_hours = max(item["signal_strength"] for item in items)

    return prepare_response(
        200,
        "Success",
        report={
            "total_records_last_24_hours": total_records_last_24_hours,
            "avg_battery_level_last_24_hours": avg_battery_level_last_24_hours,
            "avg_humidity_last_24_hours": avg_humidity_last_24_hours,
            "avg_temperature_last_24_hours": avg_temperature_last_24_hours,
            "avg_signal_strength_last_24_hours": avg_signal_strength_last_24_hours,
            "min_battery_level_last_24_hours": min_battery_level_last_24_hours,
            "max_battery_level_last_24_hours": max_battery_level_last_24_hours,
            "min_humidity_last_24_hours": min_humidity_last_24_hours,
            "max_humidity_last_24_hours": max_humidity_last_24_hours,
            "min_temperature_last_24_hours": min_temperature_last_24_hours,
            "max_temperature_last_24_hours": max_temperature_last_24_hours,
            "min_signal_strength_last_24_hours": min_signal_strength_last_24_hours,
            "max_signal_strength_last_24_hours": max_signal_strength_last_24_hours,
        },
    )
