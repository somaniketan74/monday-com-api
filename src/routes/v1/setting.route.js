import express from 'express';
import { settingController } from '../../controllers';

const router = express.Router();

router.route('/').post(settingController.createSetting).put(settingController.updateSetting).get(settingController.getSettingById);

export default router;
