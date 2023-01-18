import {removeItemFromArray} from '../utils'

const LOCK = []

export async function addToBalance(req, res){
    const {Contract, Job, Profile} = req.app.get('models');
    const profileId = req?.params?.userId;

    if(LOCK.includes(profileId)){
        return res.status(400).send({error:true, message:"Request for this user is already on process"}).end()
    }
    LOCK.push(profileId)

    const amount = req?.body?.amount

    if(!profileId || !amount) {
        return res.status(400).send({error:true, message:"Wrong data!"}).end()
    }

    const user = await Profile.findOne({where: {id: profileId}})
    if(user.type !== 'client'){
        return res.status(400).send({error:true, message:"User is not a Client"}).end()
    }

    const unpaidJobsOfUser = await Job.findAll({
        include: {
            model:Contract,
            where: {
                ClientId: profileId,
            }
        },
        where: {
            paid: null,
        }
    });
    const totalAmountToPay = unpaidJobsOfUser.reduce((acc,curr) => acc += +curr.price, 0);

    const maxAllowedDepositAmount = totalAmountToPay * 25/100;

    if (amount > maxAllowedDepositAmount) {
        return res.status(400).send({error: true, message: "You are not allowed to deposit more than 25% his total of jobs to pay."}).end();
    }

    // add to client balance
    await Profile.update(
        { balance:  user.balance + amount },
        { where:{ id: user.id }}
    );

    removeItemFromArray(LOCK, profileId);
    res.status(200).send({error: false, message: "Success."}).end();
}