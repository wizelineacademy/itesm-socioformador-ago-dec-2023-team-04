import axios, {AxiosResponse} from 'axios';

const token = process.env.DEV_AUTH0_MANAGEMENT_TOKEN
const apiUrl = process.env.AUTH0_ISSUER_BASE_URL + '/api/v2'

interface Auth0User {
    email: string,
    password: string,
}

export async function createAuth0User(user: Auth0User): Promise<string> {
    const result: AxiosResponse<{
        user_id: string
    }> = await axios.post(`${apiUrl}/users`, {
        ...user,
        connection: 'Username-Password-Authentication'
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        validateStatus: (status) => {
            return status === 201;
        }
    })

    return result.data.user_id
}
