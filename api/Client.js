import service from "./service";
import APIS from "./apis";

function getAllAnnouncements(params) {
    return service.get(APIS.client.announcement, {params});
}

function getAnnouncementById(id) {
    return service.get(APIS.client.announcement + '/' + id);
}

function addAnnouncement(body) {
    return service.post(APIS.client.announcement, body);
}

function updateAnnouncement(body, id) {
    return service.put(APIS.client.announcement + '/' + id, body);
}

function deleteAnnouncement(hash, id) {
    return service.delete(APIS.client.announcement + '/' + id, {data: {hash}});
}

function checkHash(id, hash) {
    return service.post(APIS.client.announcement + '/' + id + '/checkHash', {hash});
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAllAnnouncements,
    addAnnouncement,
    deleteAnnouncement,
    getAnnouncementById,
    checkHash,
    updateAnnouncement
}