
export async function getContractById(req, res){
    const {Contract} = req.app.get('models');
    const {id} = req.params;
    const contract = await Contract.findOne({where: {id}});
    if(!contract) return res.status(404).end();

    const requesterId = req?.profile?.id;

    const {ContractorId, ClientId} = contract;

    if(requesterId !== ContractorId && ClientId !== requesterId) { // could alse be written as ![ContractorId, ClientId].includes(requesterId)
        return res.status(401).send({error: true, message: "You are not authorized to get this contract"});
    }

    res.json(contract);
}

export async function getContracts(req, res){
    const {Contract} = req.app.get('models');
    const requesterId = req?.profile?.id;
    const type =  req?.profile?.type;

    const whereData = type === 'contractor' ? {ContractorId:requesterId} :  {ClientId:requesterId};

    const contracts = await Contract.findAll({ where: whereData });

    res.json(contracts);
}