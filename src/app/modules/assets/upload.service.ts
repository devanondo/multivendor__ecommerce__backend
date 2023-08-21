import { deleteImage, uploadImage } from '../../../helpers/imageUploader';
import { IImage } from '../../../interfaces/commong.interface';

// const uploadImages = async (
//     images: string[] | string,
//     path: string
// ): Promise<IImage[] | null> => {
//     console.log(images);

//     let uploadedImage;

//     if (images.length) {
//         uploadedImage = images.map(async (img: string) => {
//             const image = await uploadImage(path, img);
//             console.log(image);
//             return image;
//         });
//     } else {
//         uploadImage = await uploadImage(path, images);
//     }

//     return uploadedImage;
// };

const uploadImages = async (
    images: string[] | string,
    path: string
): Promise<IImage[] | null> => {
    let uploadedImages: IImage[] = [];

    if (Array.isArray(images)) {
        uploadedImages = await Promise.all(
            images.map(async (img: string) => {
                const image = await uploadImage(path, img);
                return image;
            })
        );
    } else {
        const image = await uploadImage(path, images);
        uploadedImages.push(image);
    }

    return uploadedImages.length > 0 ? uploadedImages : null;
};

const deleteImages = async (image: IImage): Promise<IImage[] | null> => {
    await deleteImage(image.public_id as string);

    return null;
};

export const UploadService = {
    uploadImages,
    deleteImages,
};
