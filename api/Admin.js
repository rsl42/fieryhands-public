import APIS from "./apis";
import service from "./service";

function getAllAnnouncements(params) {
    return service.get(APIS.admin.announcement, {params});
}

function getAnnouncementById(id) {
    return service.get(APIS.admin.announcement + '/' + id);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAllAnnouncements,
    getAnnouncementById
}