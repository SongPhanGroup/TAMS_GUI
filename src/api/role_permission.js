import { API } from './API'

export const createRolePer = async (data) => {
    const uri = `/role-permission/create-role-permission`
    const res = await API.post(uri, data)
    return res
}

export const createRoleWithManyPer = async (data) => {
    const uri = `/role-permission/create-role-with-many-permission`
    const res = await API.post(uri, data)
    return res
}

export const getAllRolePer = async (data) => {
    const uri = `/role-permission/list-all-role-permission`
    const res = await API.get(uri, data)
    return res
}

export const getPerByRoleId = async (data) => {
    const uri = `/role-permission/list-all-permission-by-roleid`
    const res = await API.get(uri, data)
    return res
}

export const deleteRolePer = async (data) => {
    const uri = `/role-permission/delete-with-permissionid-roleid`
    const res = await API.post(uri, data)
    return res
}

export const updateRolePer = async (data) => {
    const uri = `/role-permission/update-role-permission`
    const res = await API.post(uri, data)
    return res
}

export const updateRoleManyPer = async (data) => {
    const uri = `/role-permission/create-role-with-many-permission`
    const res = await API.post(uri, data)
    return res
}