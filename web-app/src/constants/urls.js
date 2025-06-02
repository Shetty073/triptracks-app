
export const BACKEND_BASE_URI = 'http://localhost:8000';

export const ENDPOINTS = {
    LOGIN: "/identity/api/login/",
    LOGOUT: "/identity/api/logout/",
    LOGOUT_ALL: "/identity/api/logout/all/",

    // Crew module
    SEARCH_USER_BY_USERNAME_OR_EMAIL: "/crew/api/crew/?email_or_username=",
    SEND_CREW_REQUEST: "/crew/api/crew/",
    FETCH_CREW_MEMBERS_FOR_CURRENT_USER: "/crew/api/crew/",
    FETCH_CREW_REQUESTS: "/crew/api/crew/?open_requests=true'",
    ACCEPT_REJECT_CREW_REQUESTS: "/crew/api/crew/",
    REMOVE_USER_FROM_CREW: "/crew/api/crew/",
};