import {removeItemFromArray} from '../utils';

const LOCK = [];

export async function getUnpaidJobs(req, res){
    const {Contract, Job} = req.app.get('models');
    const requesterId = req?.profile?.id;
    const type =  req?.profile?.type;

    const whereData = type === 'contractor' ? {ContractorId:requesterId} :  {ClientId:requesterId};

    const unpaidJobs = await Job.findAll({
        include: {
            model:Contract,
            where: {
                ...whereData,
                status: 'in_progress',
            }
        },
        where: {
            paid: null,
        }
    });

    res.json(unpaidJobs);
}


export async function pay(req, res) {
    const {job_id: JobId} = req.params
    const {Contract, Job, Profile} = req.app.get('models');

    const requesterId = req?.profile?.id;
    if (LOCK.includes(requesterId)) {
        return res.status(400).send({error: true, message: "Request for this user is already on process"}).end()
    }
    LOCK.push(requesterId)

    const balance = req?.profile?.balance;
    const unpaidJob = await Job.findOne({
        include: Contract,
        where: {
            id: JobId,
            paid: null,
        }
    });

    if (!unpaidJob) {
        return res.status(404).send({error: true, message: "Contract to pay not found"}).end()
    }

    const ContractorId = unpaidJob.Contract.ContractorId;
    const ClientId = unpaidJob.Contract.ClientId;
    const client = await Profile.findOne({where: ClientId})

    if (ClientId !== requesterId) {
        return res.status(401).send({error: true, message: "You are not allowed to pay this contract"}).end()
    }

    if (balance < unpaidJob.price) {
        return res.status(400).send({error: true, message: "You have not enough balance"}).end()
    }

    // reduse client balance
    await Profile.update(
        {balance: balance - unpaidJob.price},
        {where: {id: ClientId }}
    );

    // add to contractor  balance
    await Profile.update(
        {balance: client.balance + unpaidJob.price,},
        {where: {id: ContractorId}}
    );


    // close the job
    await Job.update(
        {
            paid: 1,
            paymentDate: Date.now()

        },
        {where: {id: unpaidJob.id}}
    );

    removeItemFromArray(LOCK, requesterId);

    res.status(200).send({error: false, message: "Congrats! Job has been successfully paid"}).end();
}