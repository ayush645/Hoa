const BASE_URL = process.env.REACT_APP_BASE_URL


export const endpoints = {
    LOGIN_API: BASE_URL + "/auth/login",
    SIGNUP_API: BASE_URL + "/auth/register",
}

export const admin = {
    CREATE_CATEGORY: BASE_URL + "/category/create",
    GET_ALL_CATEGORY: BASE_URL + "/category/getAll",
    GET_ALL_CATEGORY: BASE_URL + "/category/getAll",
    DELETE_CATEGORY: BASE_URL + "/category/delete",
    UPDATE_CATEGORY: BASE_URL + "/category/update",
    IMAGE_UPLOAD: BASE_URL + "/image/multi",

    CREATE_PROPERTY_INFORMATION: BASE_URL + "/propertyinformation/create",
    GET_ALL_PROPERTY_INFORMATION: BASE_URL + "/propertyinformation/getAll",
    GET_PROPERTY_INFORMATION: BASE_URL + "/propertyinformation/getAll",
    DELETE_PROPERTY: BASE_URL + "/propertyinformation/delete",


    CREATE_PROPERTY_COMMITI: BASE_URL + "/propertycommiti/create",
    GET_ALL_PROPERTY_COMMITI: BASE_URL + "/propertycommiti/getAll",
    GET_PROPERTY_COMMITI: BASE_URL + "/propertycommiti/getAll",
    DELETE_PROPERTY_COMMITI: BASE_URL + "/propertycommiti/delete",


    CREATE_UNITS: BASE_URL + "/units/create",
    GET_ALL_UNITS: BASE_URL + "/units/getAll",
    DELETE_UNITS: BASE_URL + "/units/delete",

    CREATE_OWNER: BASE_URL + "/owner/create",
    GET_ALL_OWNER: BASE_URL + "/owner/getAll",
    GET_OWNER: BASE_URL + "/owner/getAll",
    DELETE_OWNER: BASE_URL + "/owner/delete",



    CREATE_INCOME: BASE_URL + "/income/create",
    GET_ALL_INCOME: BASE_URL + "/income/getAll",
    GET_INCOME: BASE_URL + "/income/getAll",
    DELETE_INCOME: BASE_URL + "/income/delete",
    UPDATE_INCOME: BASE_URL + "/income/update",



    CREATE_OUTCOME: BASE_URL + "/outcome/create",
    GET_ALL_OUTCOME: BASE_URL + "/outcome/getAll",
    GET_OUTCOME: BASE_URL + "/outcome/getAll",
    DELETE_OUTCOME: BASE_URL + "/outcome/delete",
    UPDATE_OUTCOME: BASE_URL + "/outcome/update",


    CREATE_BUDGET: BASE_URL + "/budget/create",
    GET_ALL_BUDGET: BASE_URL + "/budget/getAll",
    DELETE_BUDGET: BASE_URL + "/budget/delete",
    UPDATE_BUDGET: BASE_URL + "/budget/update",


    CREATE_BUDGET_INCOME: BASE_URL + "/budgetincome/create",
    GET_ALL_BUDGET_INCOME: BASE_URL + "/budgetincome/getAll",
    GET_BUDGET_INCOME: BASE_URL + "/budgetincome/getAll",
    DELETE_BUDGET_INCOME: BASE_URL + "/budgetincome/delete",



    CREATE_BUDGET_OUTCOME: BASE_URL + "/budgetoutcome/create",
    GET_ALL_BUDGET_OUTCOME: BASE_URL + "/budgetoutcome/getAll",
    GET_BUDGET_OUTCOME: BASE_URL + "/budgetoutcome/getAll",
    DELETE_BUDGET_OUTCOME: BASE_URL + "/budgetoutcome/delete",

}