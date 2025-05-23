export interface User {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    phoneNumber: string,
    gender: string,
    userIdKeycloak: string,
    dateOfBirth: string,
    location: {
        locationInfoId: string,
        nationality: string,
        country: string,
        region: string,
        department: string,
        address: string
    },
    role: string,
    active: boolean
}