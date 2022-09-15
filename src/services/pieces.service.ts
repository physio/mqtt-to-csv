import { Injectable } from '@nestjs/common';
import { Piece } from 'src/models/piece.model';
import { InjectModel } from '@nestjs/sequelize';
import { PieceDto } from 'src/dto/create-piece.dto';
import * as moment from 'moment';

@Injectable()
export class PiecesService {
    constructor(
        @InjectModel(Piece)
        private readonly pieceModel: typeof Piece,
    ) {

    }


    create(order: PieceDto): Promise<Piece> {
        return this.pieceModel.create({
            workOrder: order,
            start: moment.utc()
        });
    }

    close(projectId: number): Promise<[any]> {
        return Piece.update({
            stop: moment.utc()
        }, {
            where: { id: projectId }
        })
    }

    async findAll(): Promise<Piece[]> {
        return this.pieceModel.findAll();
    }

    findOne(id: number): Promise<Piece> {
        return this.pieceModel.findOne({
            where: {
                id,
            },
        });
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await user.destroy();
    }
}