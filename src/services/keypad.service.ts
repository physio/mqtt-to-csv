import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class KeyPressService {
    private _orderNumber = '';
    private _partial = '';

    constructor(
        private eventEmitter: EventEmitter2,

    ) {
        const stdin = process.stdin;

        // without this, we would only get streams once enter is pressed
        stdin.setRawMode(true);

        // resume stdin in the parent process (node app won't quit all by itself
        // unless an error or process.exit() happens)
        stdin.resume();

        // i don't want binary, do you?
        stdin.setEncoding('utf8');

        // on any data into stdin
        stdin.on('data', (key) => {
            // ctrl-c ( end of text )
            if (key as unknown === '\u0003') {
                process.exit();
            }

            if (key as unknown === 'ì') {
                if (this._orderNumber != '') {
                    this.eventEmitter.emit('count-pieces.add', this._orderNumber);
                }
            } else {
                const match = /\r|\n/.exec(key.toString("utf8"));
                if (match) {
                    this._orderNumber = this._partial;
                    this.eventEmitter.emit('count-pieces.order', this._orderNumber);
                    // this._orderNumber = '';
                    this._partial = '';
                } else {
                    this._partial = this._partial + key as string;
                }
            }

            // write the key to stdout all normal like
            // process.stdout.write(key);
        });
    }




}
