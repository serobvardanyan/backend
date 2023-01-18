import {ENUM, STRING, DECIMAL, Model} from "sequelize";
import {sequelize} from "./index";

export class Profile extends Model {}

Profile.init(
    {
        firstName: {
            type: STRING,
            allowNull: false
        },
        lastName: {
            type: STRING,
            allowNull: false
        },
        profession: {
            type: STRING,
            allowNull: false
        },
        balance:{
            type:DECIMAL(12,2)
        },
        type: {
            type: ENUM('client', 'contractor')
        }
    },
    {
        sequelize,
        modelName: 'Profile'
    }
);