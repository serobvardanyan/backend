import {
    Sequelize,
} from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3'
});

import {Profile} from "./profile";
import {Contract} from './contract';
import {Job} from "./job";

Profile.hasMany(Contract, {as :'Contractor',foreignKey:'ContractorId'})
Profile.hasMany(Contract, {as : 'Client', foreignKey:'ClientId'})

Contract.belongsTo(Profile, {as: 'Contractor'})
Contract.belongsTo(Profile, {as: 'Client'})
Contract.hasMany(Job)

Job.belongsTo(Contract)

