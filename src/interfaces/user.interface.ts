import { Entity } from "./entity.interface"

export enum Roles {
    EMPLOYEE,
    ADMINISTRATOR
}

export interface Name {
    firstName: string,
    lastName: string
}

export interface Geolocation {
    lat: string,
    long: string
}

export interface Address {
    city: string,
    street: string,
    number: number,
    zipCode: string,
    geolocation: Geolocation
}

/**
 * @ref 
 * - https://github.com/keikaavousi/fake-store-api/blob/master/model/user.js
 */
export interface User extends Entity {
    email: string,
    username: string,
    password: string,
    name: Name,
    address: Address | null,
    phone: string | null,
    role: Roles
}

