import { get_account_type } from "@/composables/request"

export const isActiveEnterpriseAccount = () => {
    return get_account_type() === 'enterprise'
}