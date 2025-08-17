import { Router } from 'express';
import { getSemesters, getTimeTableData, getWeeksInSemester } from '~/controllers/timeTableController';

const router = Router();

router.get('/semesters', getSemesters);
router.post('/weeks', getWeeksInSemester);
router.post('/data', getTimeTableData);
export { router as timeTableRouter };
