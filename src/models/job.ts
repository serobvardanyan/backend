import {BOOLEAN, DATE, DECIMAL, Model, TEXT} from "sequelize";
import {sequelize} from "./index";

export class Job extends Model {}
Job.init(
    {
        description: {
            type: TEXT,
            allowNull: false
        },
        price:{
            type: DECIMAL(12,2),
            allowNull: false
        },
        paid: {
            type: BOOLEAN,
            defaultValue: false
        },
        paymentDate:{
            type: DATE
        }
    },
    {
        sequelize,
        modelName: 'Job'
    }
);