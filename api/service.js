import axios from 'axios';
import cookies from 'nookies';
import Swal from 'sweetalert2';
import { apiURL } from '../config/urls'

const getToken = () => {
    return cookies.get(null).token || null;
};

const service = axios.create({
    baseURL: apiURL,
    headers: {
        Authorization: {
            toString () {
                return getToken();
            }
        },
    }
});

service.interceptors.response.use(
    function (response) {
        if (!response?.data?.success) {
            Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: response?.data?.message
            })
        }
        return response?.data;
    },
    function (error) {
        Swal.fire({
            icon: 'error',
            title: 'Xəta!'
        })        // if (error.response.status === 401) {
        //     localStorage.removeItem('kiraye_userData');
        //     cookies.destroy(null, 'token', {path: '/'});
        //     window.location.replace('/login')
        // }
        return Promise.reject(error);
    }
);

export default service;
