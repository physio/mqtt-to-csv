import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Piece extends Model {
    @Column({ primaryKey: true })
    id: number;

    @Column
    workOrder: string;

    @Column
    start: string;

    @Column
    stop: string;
}