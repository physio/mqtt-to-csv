import { BufferClass } from "./buffer.class";

jest.mock('moment', () => {
    return () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z');
});

const bufferClass = new BufferClass();


describe('BufferClass', () => {


    describe('getData', () => {
        it('buffer empty', () => {
            expect(bufferClass.getData()).toBe("");
        });

        it('buffer with 30 elements', () => {

            const telemetry = {
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
            };

            for (let index = 0; index < 30; index++) {
                bufferClass.push(telemetry)
            }

            expect(bufferClass.push(telemetry)).toBe("1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1");
        });

        it('buffer with 1 element', () => {

            const bufferClassNew = new BufferClass();

            const telemetry = {
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
            };

            bufferClass.push(telemetry)

            expect(bufferClassNew.push(telemetry)).toBe("1");
        });
    });



});