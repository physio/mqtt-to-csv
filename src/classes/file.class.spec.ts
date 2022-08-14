import { FileClass } from "./file.class";

jest.mock('moment', () => {
    return () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z');
});

let fileClass = new FileClass;


describe('FileClass', () => {


    describe('getNow', () => {
        it('should return an number', () => {
            expect(fileClass['getNow']()).toBe("data-2020-01-01-01-00-00");
        });


    });



});