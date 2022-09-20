import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { TelemetryInterface } from 'src/interfaces/telemetry.interface';
import { FormatStringClass } from './format-string.class';
import { DataClass } from './data.class';

export class FileClass {
    public fileName = "no-name.csv";

    /**
     * Create fileName
     * 
     * @author Gallo Mauro <mauro.gallo@mentel.it>
     * @date 2022-08-13
     * @returns {any}
     */
    public create(): string {
        this.fileName = `${DataClass.getNow()}.csv`;

        fs.writeFile(this.fileName, FormatStringClass.getHeader(), (err) => {
            if (err) throw err;
        })
        return this.fileName;
    }

    /**
     * Append row to file
     * 
     * @author Gallo Mauro <mauro.gallo@mentel.it>
     * @date 2022-08-14
     * @param {any} filename:string
     * @param {any} telemetry:TelemetryInterface
     * @returns {any}
     */
    public append(telemetry: TelemetryInterface) {
        const row = FormatStringClass.getString(telemetry);

        fs.appendFile(this.fileName, row, (err) => {
            if (err) throw err;
            //.error(err);
        });
    }

    public delete() {
        fs.stat('*.csv', function (err, stats) {
            console.log(stats);//here we got all information of file in stats variable

            if (err) {
                return console.error(err);
            }

            fs.unlink('.csv', function (err) {
                if (err) return console.log(err);
                console.log('file deleted successfully');
            });
        });
    }

}