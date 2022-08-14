import { FormatStringClass } from "./format-string.class";

jest.mock('moment', () => {
    return () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z');
});

let formatStringClass = new FormatStringClass;


describe('FormatStringClass', () => {

    let telemetryOk = {
        "accelerometer": {
            "x": 1,
            "y": -29,
            "z": 1027
        },
        "humidity": 27,
        "pressure": 100416,
        "temperature": 32,
        "magnetometer": {
            "x": -73,
            "y": -68,
            "z": -18,
            "r": 6046
        },
        "gyro": {
            "x": 183,
            "y": -61,
            "z": 244
        },
        "lightSensor": 51840,
        "noiseSensor": 0.000383
    }

    let telemetryKo = {
        "accelerometer": {
            "x": 1,
            "y": -29,
            "z": 1027
        },
        "pressure": 100416,
        "temperature": 32,
        "magnetometer": {
            "x": -73,
            "y": -68,
            "z": -18,
            "r": 6046
        },
        "gyro": {
            "x": 183,
            "y": -61,
            "z": 244
        },
        "lightSensor": 51840,
        "noiseSensor": 0.000383
    }

    let returnOk = "1,-29,1027,183,-61,244,27,51840,6046,-73,-68,-18,0.000383,100416,32";

    describe('getString', () => {
        it('should return a right string', () => {
            expect(formatStringClass['getString'](telemetryOk)).toBe(returnOk);
        });

        it('should return an error', () => {
            expect(formatStringClass['getString'](telemetryOk)).toBe(returnOk);
        });
    });



});