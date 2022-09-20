export class DataClass {

    /**
     * Get now with prefix
     * 
     * @author Gallo Mauro <mauro.gallo@mentel.it>
     * @date 2022-08-13
     * @returns {any}
     */
    public static getNow(): string {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const moment = require('moment');
        return "data-" + moment().format('YYYY-MM-DD-HH-mm-ss');
    }
}