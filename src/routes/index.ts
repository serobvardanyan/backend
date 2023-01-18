import {Router, IRouter} from "express";
import {getProfile} from "../middleware/getProfile";
import {getContractById, getContracts} from "../controllers/contract";
import {getUnpaidJobs,pay} from "../controllers/job";
import {addToBalance} from "../controllers/profile";
import {bestProfession,bestClients} from "../controllers/admin";

export const router: IRouter = Router()

/**
 * @returns contract by id
 */
router.get('/contracts/:id', getProfile, getContractById);

/**
 * @returns  list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.
 */
router.get('/contracts', getProfile, getContracts);

/**
 * @returns all unpaid jobs for a user (either a client or contractor), for active contracts only.
 */
router.get('/jobs/unpaid', getProfile, getUnpaidJobs);

/**
 * Pays for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
 */
router.post('/jobs/:job_id/pay', getProfile, pay)

/**
 *  Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 */
router.post('/balances/deposit/:userId', addToBalance)

/**
 *  @returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 */
router.get('/admin/best-profession', bestProfession)

/**
 *  @returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
 */
router.get('/admin/best-clients', bestClients)

