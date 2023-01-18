import {Model,TEXT,ENUM} from "sequelize";
import {sequelize} from "./index";

export class Contract extends Model {}
Contract.init(
    {
        terms: {
            type: TEXT,
            allowNull: false
        },
        status:{
            type: ENUM('new','in_progress','terminated')
        }
    },
    {
        sequelize,
        modelName: 'Contract'
    }
);