import { API } from './API'

export const loginMember = async (data) => {
    const uri = `/auth/loginMember`
    const res = await API.post(uri, data)
    return res
}

// export const changePass = async (data) => {
//     const uri = `/auth/changePass`
//     const res = await API.post(uri, data)
//     return res
// }

export const getMember = async () => {
    const uri = `/admin/get-member-profile`
    const res = await API.get(uri)
    return res
}