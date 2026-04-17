const router = require('express').Router();
const { authRequired } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const {
  listRecords,
  uploadRecord,
  getRecord,
  deleteRecord
} = require('../controllers/doctorRecordController');

router.use(authRequired);
router.get('/', listRecords);
router.post('/', upload.single('file'), uploadRecord);
router.get('/:id', getRecord);
router.delete('/:id', deleteRecord);

module.exports = router;
