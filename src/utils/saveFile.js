import getEnvVar from './getEnvVar.js';
import { saveFileToCloudinary } from './saveFileToCloudinary.js';
import { saveFileToUploadDir } from './saveFileToUploadDir.js';

export const saveFile = async (file) => {
  return getEnvVar('ENABLE_CLOUDINARY') === 'true'
    ? await saveFileToCloudinary(file)
    : await saveFileToUploadDir(file);
};