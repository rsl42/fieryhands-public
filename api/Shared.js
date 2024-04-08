import APIS from "./apis";
import service from "./service";

function upload(files) {
    const formData = new FormData();
    if (files?.length > 0) {
        files?.forEach(file => {
            formData.append('files', file?.blobFile);
        });
    }
    return service.post(APIS.shared.file, formData);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    upload
}