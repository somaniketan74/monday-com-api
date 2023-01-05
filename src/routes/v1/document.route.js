import express from 'express';
import { documentController } from '../../controllers';

const router = express.Router();

router.route('/').post(documentController.createDocument).get(documentController.getDocuments);

export default router;
