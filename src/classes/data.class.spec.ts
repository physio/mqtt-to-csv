import { DataClass } from "./data.class";

jest.mock('moment', () => {
    return () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z');
});

let dataClass = new DataClass;


describe('DataClass', () => {


    describe('getNow', () => {
        it('should return an number', () => {
            expect(dataClass['getNow']()).toBe("data-2020-01-01-01-00-00");
        });


    });



});