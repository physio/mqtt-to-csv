import { Logger } from "@nestjs/common";

export const machine = {
    rows: 1,
    state: 'EMPTY',
    transitions: {
        EMPTY: {
            next() {
                this.state = 'APPEND'
            }
        },
        APPEND: {
            next() {
                if (this.rows + 1 < process.env.ROWS_IN_CSV) {
                    this.rows = this.rows + 1;
                    this.state = 'APPEND';
                } else {
                    this.state = "CLOSE";
                }
            },
        },
        CLOSE: {
            next() {
                this.state = 'CLOSED';
            },
        },
    },
    dispatch(actionName) {
        const action = this.transitions[this.state][actionName];

        if (action) {
            action.call(this);
        } else {
            Logger.error('invalid action');
        }
    },
};