import { uploadImage } from '../../../helpers/imageUploader';
import { IImage } from '../../../interfaces/commong.interface';

const uploadImages = async (
    image: string,
    path: string
): Promise<IImage | null> => {
    const img = await uploadImage(path, image);

    return img;
};

export const UploadService = {
    uploadImages,
};
