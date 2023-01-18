import {Op} from "sequelize";
import {orderBy} from "lodash";

export async function bestProfession(req, res){
    const {Profile, Job, Contract} = req.app.get('models');
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);

    if(!startDate || !endDate) {
        return res.status(400).send({error: true, message: "Wrong Data!"}).end()
    }

    const jobs = await Job.findAll({
        include: {
            model:Contract,
            include: {
                model: Profile,
                attributes: ['profession'],
                as:"Contractor"
            }
        },
        where: {
            createdAt:{
                [Op.between]: [startDate, endDate]
            },
            paid:1
        }
    })

    const amountByProfessions = jobs.reduce((acc, curr) => {
        const profession = curr?.Contract?.Contractor.profession
        const earnedAmount = curr.price
        acc[profession] =( acc[profession] || 0) + earnedAmount
        return acc
    }, {})
    const OrderedProfessions = orderBy(
        Object.keys(amountByProfessions).map((profession) =>{
        const amoumt = amountByProfessions[profession]
        return {
            profession,
            earnedAmount: amoumt
        }
    }),'earnedAmount', 'desc')
    res.json(OrderedProfessions );
}

export async function bestClients(req, res){
    const {Profile, Job, Contract} = req.app.get('models');

    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);
    const limit  = req.query.limit || 2;

    if(!startDate || !endDate) {
        return res.status(400).send({error: true, message: "Wrong Data!"}).end()
    }

    const jobs = await Job.findAll({
        include: {
            model:Contract,
            include: {
                model: Profile,
                attributes: ['id', 'firstName', 'lastName'],
                as: "Client"
            }
        },
        where: {
            createdAt:{
                [Op.between]: [startDate, endDate]
            },
            paid:1
        },
        limit
    })

    const amountByClients = jobs.reduce((acc, curr) => {
        const client = curr?.Contract?.Client

        const paidAmount = curr.price;
        acc[client.id] = acc[client.id] || {};
        acc[client.id].fullName = acc[client.id].fullName || client.firstName + ' ' + client.lastName;
        acc[client.id].paid =(acc[client.id].paid || 0) + paidAmount;

        return acc;
    }, {})
    const OrderedClients = orderBy(
        Object.keys(amountByClients).map((client) =>{
            const clientData = amountByClients[client]
            return {
                id: client,
                ...clientData
            }
        }),'paid', 'desc')
    res.json(OrderedClients);
}
