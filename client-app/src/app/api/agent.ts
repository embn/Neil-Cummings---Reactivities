import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { Activity, ActivityFormValues } from "../models/activity";
import { PaginatedResult } from "../models/pagination";
import { User, UserFormValues } from "../models/user";
import { Photo, UserActivity, UserProfile } from "../models/userProfile";
import { store } from "../stores/store";


axios.defaults.baseURL = 'http://localhost:5000/api';


//delay fakery for testing
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.interceptors.response.use(async response => { 
    await sleep(500);
    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>
    }
    return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    switch (status) {
        case 400:
            if (typeof data === 'string') {
                toast.error(data);
            }
            if (config.method?.toUpperCase() === 'GET' && data.errors.hasOwnProperty('id')) { 
                history.push('/not-found');
            }
            if (data.errors) {
                const stateErrors = [];
                for (const key in data.errors ) {
                    /* object property accesor syntax */
                    if (data.errors[key]) {
                        stateErrors.push(data.errors[key]);
                    }
                }
                throw stateErrors.flat();
            }
            break;
        case 401:
            toast.error('unauthorized');
            break;
        case 404:
            history.push('/not-found')
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
});

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const responseBody = <T> (response : AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}
const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', { params }).then(responseBody),
    details: (id: string) => requests.get<Activity>(`activities/${id}`),
    create: (activity : ActivityFormValues) => requests.post<void>('activities', activity),
    update: (activity : ActivityFormValues) => requests.put<void>(`activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`activities/${id}`),
    attend: (id: string) => requests.post<void>(`activities/${id}/attend`, {}),
}
const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}
//keys needs to match parameter in API
const Profile = {
    get: (username: string) => requests.get<UserProfile>(`/profile/${username}`),
    update: (profile: Partial<UserProfile>) => requests.put(`/profile`, profile),
    updateFollowing: (userName: string) => requests.post(`/follow/${userName}`, {}),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file )
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        })
        .then(responseBody);
    },
    setMainPhoto: (id: string) => requests.put(`photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`photos/${id}`),
    listFollowing: (userName: string, predicate: string) => requests.get<UserProfile[]>(`/follow/${userName}?predicate=${predicate}`),
    listActivities: (userName: string, predicate: string) => requests.get<UserActivity[]>(`/profile/${userName}/activities?predicate=${predicate}`),
}
const agent = {
    Activities,
    Account,
    Profile 
}
export default agent;