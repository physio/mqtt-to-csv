export interface TelemetryInterface {
    "accelerometer": {
        "x": number,
        "y": number,
        "z": number
    },
    "humidity": number,
    "pressure": number,
    "temperature": number,
    "magnetometer": {
        "x": number,
        "y": number,
        "z": number,
        "r": number
    },
    "gyro": {
        "x": number,
        "y": number,
        "z": number
    },
    "lightSensor": number,
    "noiseSensor": number
}

