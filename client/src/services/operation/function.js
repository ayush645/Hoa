import { apiConnector } from "../apiConnector";
import { admin } from "../api";
import Swal from "sweetalert2";
const {
    CREATE_CATEGORY,
    GET_ALL_CATEGORY,
    DELETE_CATEGORY,
    UPDATE_CATEGORY,
    IMAGE_UPLOAD,
    CREATE_PROPERTY_INFORMATION,
    GET_ALL_PROPERTY_INFORMATION,
    DELETE_PROPERTY,
    CREATE_PROPERTY_COMMITI,
    GET_ALL_PROPERTY_COMMITI,
    DELETE_PROPERTY_COMMITI,
    CREATE_UNITS,
    DELETE_UNITS,
    GET_ALL_UNITS,
    CREATE_OWNER,
    DELETE_OWNER,
    GET_ALL_OWNER,
    CREATE_INCOME,
    GET_ALL_INCOME,
    DELETE_INCOME,
    CREATE_OUTCOME,
    GET_ALL_OUTCOME,
    DELETE_OUTCOME,

    CREATE_BUDGET,
    DELETE_BUDGET,
    GET_ALL_BUDGET,
    UPDATE_BUDGET,


    CREATE_BUDGET_INCOME,
    DELETE_BUDGET_INCOME,
    GET_ALL_BUDGET_INCOME,


    CREATE_BUDGET_OUTCOME,
    DELETE_BUDGET_OUTCOME,
    GET_ALL_BUDGET_OUTCOME,


    GET_PROPERTY_INFORMATION,
    GET_PROPERTY_COMMITI,
    GET_OWNER,
    GET_INCOME,
    GET_OUTCOME,
    GET_BUDGET_INCOME,
    GET_BUDGET_OUTCOME,


    UPDATE_INCOME,
    UPDATE_OUTCOME



} = admin;


export async function createCategoryApi(name) {
    Swal.fire({
        title: "Creating Category...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        const response = await apiConnector("POST", CREATE_CATEGORY, { name });
        Swal.close();

        if (!response?.data?.success) {
            await Swal.fire({
                title: "Category Creation Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }

        Swal.fire({
            title: response.data.message,
            text: "Your category has been added.",
            icon: "success",
        });

        return response.data.category;
    } catch (error) {
        console.log("CREATE CATEGORY ERROR............", error);
        Swal.fire({
            title: "Failed to Create Category",
            text:
                error.response?.data?.message ||
                "Something went wrong, please try again later.",
            icon: "error",
        });
        throw error;
    }
}


export async function getAllCategoryApi() {
    let result = [];
    try {
        const response = await apiConnector("GET", GET_ALL_CATEGORY);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Category Creation Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.categories;
        return result;
    } catch (error) {

        console.log("CREATE CATEGORY ERROR............", error);
        Swal.fire({
            title: "Failed to Create Category",
            text:
                error.response?.data?.message ||
                "Something went wrong, please try again later.",
            icon: "error",
        });
        return result
    }
}

export const deleteCategoryApi = async (id) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_CATEGORY}/${id}`);
        if (!response?.data?.success) {
            Swal.fire({
                title: "Delete Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        Swal.fire({
            title: "Deleted",
            text: "Category deleted successfully!",
            icon: "success",
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Something went wrong. Try again later.",
            icon: "error",
        });
        return false; // Return false on failure
    }
};

export const updateCategoryApi = async (id, name) => {
    try {
        const response = await apiConnector("PUT", `${UPDATE_CATEGORY}/${id}`, { name });
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};


export const imageUpload = async (data) => {
    let result = [];
    const toastId = Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        const formData = new FormData();
        for (let i = 0; i < data.length; i++) {
            formData.append("thumbnail", data[i]);
        }

        const response = await apiConnector("POST", IMAGE_UPLOAD, formData);

        if (!response?.data?.success) {
            throw new Error("Could Not Add Image Details");
        }

        Swal.fire({
            icon: "success",
            title: "Image Details Added Successfully",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
        });

        result = response?.data?.images;
    } catch (error) {
        console.log("CREATE IMAGE API ERROR............", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
        });
    } finally {
        Swal.close(toastId);
    }

    return result;
};


export async function handleCreatePropertyInforamtionAPi(propertyData) {
    // Show loading alert
    Swal.fire({
        title: "Creating Property Information...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        // Send POST request with propertyData
        const response = await apiConnector("POST", CREATE_PROPERTY_INFORMATION, { propertyData });

        // Close the loading alert
        Swal.close();

        // Check if the API response indicates success
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Property Information Creation Failed",
                text: response.data.message || "Failed to create property information.",
                icon: "error",
            });
            throw new Error(response.data.message);
        }

        // Show success message
        Swal.fire({
            title: "Success!",
            text: response.data.message || "Property information has been added.",
            icon: "success",
        });

        // Return the created property data (optional)
        return response.data.property;
    } catch (error) {
        // Handle errors and show error message
        console.error("CREATE PROPERTY ERROR:", error);
        Swal.fire({
            title: "Failed to Create Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        throw error; // Re-throw the error for further handling if necessary
    }
}




export async function getAllPropertyInformationApi(id) {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_ALL_PROPERTY_INFORMATION}/${id}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Information",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY INFORMATION ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}


export async function getPropertyInformationApi() {
    let result = [];
    try {
        const response = await apiConnector("GET", GET_PROPERTY_INFORMATION);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Information",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY INFORMATION ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}


export const deletePropertyInformationApi = async (id) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_PROPERTY}/${id}`);
        if (!response?.data?.success) {
            Swal.fire({
                title: "Delete Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        Swal.fire({
            title: "Deleted",
            text: "Category deleted successfully!",
            icon: "success",
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Something went wrong. Try again later.",
            icon: "error",
        });
        return false;
    }
};


export async function handleCreatePropertyCommitiAPi(propertyData) {
    // Show loading alert
    Swal.fire({
        title: "Creating Property Information...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        // Send POST request with propertyData
        const response = await apiConnector("POST", CREATE_PROPERTY_COMMITI, { propertyData });

        // Close the loading alert
        Swal.close();

        // Check if the API response indicates success
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Property Information Creation Failed",
                text: response.data.message || "Failed to create property information.",
                icon: "error",
            });
            throw new Error(response.data.message);
        }

        // Show success message
        Swal.fire({
            title: "Success!",
            text: response.data.message || "Property information has been added.",
            icon: "success",
        });

        // Return the created property data (optional)
        return response.data.property;
    } catch (error) {
        // Handle errors and show error message
        console.error("CREATE PROPERTY ERROR:", error);
        Swal.fire({
            title: "Failed to Create Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        throw error; // Re-throw the error for further handling if necessary
    }
}

export async function getAllCommitiApi(id) {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_ALL_PROPERTY_COMMITI}/${id}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Information",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY INFORMATION ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}
export async function getCommitiApi() {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_PROPERTY_COMMITI}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Information",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY INFORMATION ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}


export const deleteCommitiApi = async (id) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_PROPERTY_COMMITI}/${id}`);
        if (!response?.data?.success) {
            Swal.fire({
                title: "Delete Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        Swal.fire({
            title: "Deleted",
            text: "Category deleted successfully!",
            icon: "success",
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Something went wrong. Try again later.",
            icon: "error",
        });
        return false;
    }
};
export async function handleCreateUnitsAPi(propertyData) {
    // Show loading alert
    Swal.fire({
        title: "Creating Property Information...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        // Send POST request with propertyData
        const response = await apiConnector("POST", CREATE_UNITS, { propertyData });

        // Close the loading alert
        Swal.close();

        // Check if the API response indicates success
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Property Information Creation Failed",
                text: response.data.message || "Failed to create property information.",
                icon: "error",
            });
            throw new Error(response.data.message);
        }

        // Show success message
        Swal.fire({
            title: "Success!",
            text: response.data.message || "Property information has been added.",
            icon: "success",
        });

        // Return the created property data (optional)
        return response.data.property;
    } catch (error) {
        // Handle errors and show error message
        console.error("CREATE PROPERTY ERROR:", error);
        Swal.fire({
            title: "Failed to Create Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        throw error; // Re-throw the error for further handling if necessary
    }
}

export async function getAllUnitsApi(id) {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_ALL_UNITS}/${id}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Information",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY INFORMATION ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}


export const deleteUnitsApi = async (id) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_UNITS}/${id}`);
        if (!response?.data?.success) {
            Swal.fire({
                title: "Delete Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        Swal.fire({
            title: "Deleted",
            text: "Category deleted successfully!",
            icon: "success",
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Something went wrong. Try again later.",
            icon: "error",
        });
        return false;
    }
};



export async function handleCreateOwnerAPi(propertyData) {
    // Show loading alert
    Swal.fire({
        title: "Creating Owner Information...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        const response = await apiConnector("POST", CREATE_OWNER, { propertyData });

        Swal.close();

        if (!response?.data?.success) {
            await Swal.fire({
                title: "Property Owner Creation Failed",
                text: response.data.message || "Failed to create property information.",
                icon: "error",
            });
            throw new Error(response.data.message);
        }

        // Show success message
        Swal.fire({
            title: "Success!",
            text: response.data.message || "Property Owner has been added.",
            icon: "success",
        });

        // Return the created property data (optional)
        return response.data.property;
    } catch (error) {
        // Handle errors and show error message
        console.error("CREATE PROPERTY ERROR:", error);
        Swal.fire({
            title: "Failed to Create Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        throw error; // Re-throw the error for further handling if necessary
    }
}

export async function getAllOwnerApi(id) {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_ALL_OWNER}/${id}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Owner",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY OWNER ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Owner",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}
export async function getOwnerApi() {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_OWNER}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Owner",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY OWNER ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Owner",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}


export const deleteOwnerApi = async (id) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_OWNER}/${id}`);
        if (!response?.data?.success) {
            Swal.fire({
                title: "Delete Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        Swal.fire({
            title: "Deleted",
            text: "Owner deleted successfully!",
            icon: "success",
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Something went wrong. Try again later.",
            icon: "error",
        });
        return false;
    }
};



export async function handleCreateIncomeApi(incomePayload) {
    // Show loading alert
    Swal.fire({
        title: "Creating Income Information...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        // Call the API using apiConnector
        const response = await apiConnector("POST", CREATE_INCOME, incomePayload);

        // Close loading alert
        Swal.close();

        if (!response?.data?.success) {
            await Swal.fire({
                title: "Income Creation Failed",
                text: response?.data?.message || "Failed to create income information.",
                icon: "error",
            });
            throw new Error(response?.data?.message);
        }

        // Show success message
        Swal.fire({
            title: "Success!",
            text: response?.data?.message || "Income information has been added.",
            icon: "success",
        });

        // Return the created income data (optional)
        return response?.data?.income;
    } catch (error) {
        // Handle errors and show error message
        console.error("CREATE INCOME ERROR:", error);
        Swal.fire({
            title: "Failed to Create Income Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        throw error; // Re-throw the error for further handling if necessary
    }
}


export const deleteIncomeApi = async (id) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_INCOME}/${id}`);
        if (!response?.data?.success) {
            Swal.fire({
                title: "Delete Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        Swal.fire({
            title: "Deleted",
            text: "Owner deleted successfully!",
            icon: "success",
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Something went wrong. Try again later.",
            icon: "error",
        });
        return false;
    }
};


export const updateMonthIncomeApi = async (id, month, amount) => {
    try {
        console.log("Updating income with:", { id, month, amount }); // Debugging

        const response = await apiConnector("PUT", `${UPDATE_INCOME}/${id}`, { month, amount });
        return response.data;
    } catch (error) {
        console.error("Error updating month:", error);
        throw error;
    }
};

export const updateMonthOutComeApi = async (id, month, amount) => {
    try {
        console.log("Updating outcome with:", { id, month, amount }); // Debugging

        const response = await apiConnector("PUT", `${UPDATE_OUTCOME}/${id}`, { month, amount });
        return response.data;
    } catch (error) {
        console.error("Error updating month:", error);
        throw error;
    }
};

export async function getAllIncomeApi(id) {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_ALL_INCOME}/${id}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Owner",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY OWNER ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Owner",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}

export async function getIncomeApi() {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_INCOME}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Owner",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY OWNER ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Owner",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}


export async function handleCreateOutcomeAPi(propertyData) {
    // Show loading alert
    Swal.fire({
        title: "Creating Owner Information...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        const response = await apiConnector("POST", CREATE_OUTCOME, { propertyData });

        Swal.close();

        if (!response?.data?.success) {
            await Swal.fire({
                title: "Property Outcome Creation Failed",
                text: response.data.message || "Failed to create property outcome.",
                icon: "error",
            });
            throw new Error(response.data.message);
        }

        // Show success message
        Swal.fire({
            title: "Success!",
            text: response.data.message || "Property outcome has been added.",
            icon: "success",
        });

        // Return the created property data (optional)
        return response.data.outcome;
    } catch (error) {
        // Handle errors and show error message
        console.error("CREATE PROPERTY ERROR:", error);
        Swal.fire({
            title: "Failed to Create Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        throw error; // Re-throw the error for further handling if necessary
    }
}

export async function getAllOutcomeApi(id) {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_ALL_OUTCOME}/${id}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Outcome",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY OWNER ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Owner",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}
export async function getOutcomeApi() {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_OUTCOME}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Outcome",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY OWNER ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Owner",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}


export const deleteOutComeApi = async (id) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_OUTCOME}/${id}`);
        if (!response?.data?.success) {
            Swal.fire({
                title: "Delete Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        Swal.fire({
            title: "Deleted",
            text: "Outcome deleted successfully!",
            icon: "success",
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Something went wrong. Try again later.",
            icon: "error",
        });
        return false;
    }
};






export async function createBudgetApi(name) {
    Swal.fire({
        title: "Creating Category...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        const response = await apiConnector("POST", CREATE_BUDGET, { name });
        Swal.close();

        if (!response?.data?.success) {
            await Swal.fire({
                title: "Budget Creation Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }

        Swal.fire({
            title: response.data.message,
            text: "Your budget has been added.",
            icon: "success",
        });

        return response.data.category;
    } catch (error) {
        console.log("CREATE Budget ERROR............", error);
        Swal.fire({
            title: "Failed to Create Category",
            text:
                error.response?.data?.message ||
                "Something went wrong, please try again later.",
            icon: "error",
        });
        throw error;
    }
}


export async function getAllBudgetApi() {
    let result = [];
    try {
        const response = await apiConnector("GET", GET_ALL_BUDGET);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Budget Creation Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.categories;
        return result;
    } catch (error) {

        console.log("CREATE CATEGORY ERROR............", error);
        Swal.fire({
            title: "Failed to Create Budget",
            text:
                error.response?.data?.message ||
                "Something went wrong, please try again later.",
            icon: "error",
        });
        return result
    }
}

export const deleteBudgetApi = async (id) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_BUDGET}/${id}`);
        if (!response?.data?.success) {
            Swal.fire({
                title: "Delete Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        Swal.fire({
            title: "Deleted",
            text: "Budget deleted successfully!",
            icon: "success",
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Something went wrong. Try again later.",
            icon: "error",
        });
        return false; // Return false on failure
    }
};

export const updateBudgetApi = async (id, name) => {
    try {
        const response = await apiConnector("PUT", `${UPDATE_BUDGET}/${id}`, { name });
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};




export async function CreateBudgetIncomeAPi(propertyData) {
    // Show loading alert
    Swal.fire({
        title: "Creating Budget Income Information...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        const response = await apiConnector("POST", CREATE_BUDGET_INCOME, { propertyData });

        Swal.close();

        if (!response?.data?.success) {
            await Swal.fire({
                title: "Budget Income Creation Failed",
                text: response.data.message || "Failed to create property outcome.",
                icon: "error",
            });
            throw new Error(response.data.message);
        }

        // Show success message
        Swal.fire({
            title: "Success!",
            text: response.data.message || "Property outcome has been added.",
            icon: "success",
        });

        // Return the created property data (optional)
        return response.data.property;
    } catch (error) {
        // Handle errors and show error message
        console.error("CREATE PROPERTY ERROR:", error);
        Swal.fire({
            title: "Failed to Create Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        throw error; // Re-throw the error for further handling if necessary
    }
}

export async function getAllBudgetIncomeApi(id) {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_ALL_BUDGET_INCOME}/${id}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Outcome",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY OWNER ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Owner",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}
export async function getBudgetIncomeApi() {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_BUDGET_INCOME}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Property Outcome",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY OWNER ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Owner",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}


export const deleteBudgetIncomeApi = async (id) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_BUDGET_INCOME}/${id}`);
        if (!response?.data?.success) {
            Swal.fire({
                title: "Delete Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        Swal.fire({
            title: "Deleted",
            text: "Budget Income successfully!",
            icon: "success",
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Something went wrong. Try again later.",
            icon: "error",
        });
        return false;
    }
};





export async function createBudgetOutcomeAPi(propertyData) {
    // Show loading alert
    Swal.fire({
        title: "Creating Owner Information...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        const response = await apiConnector("POST", CREATE_BUDGET_OUTCOME, { propertyData });

        Swal.close();

        if (!response?.data?.success) {
            await Swal.fire({
                title: "Budget Outcome Creation Failed",
                text: response.data.message || "Failed to create property outcome.",
                icon: "error",
            });
            throw new Error(response.data.message);
        }

        // Show success message
        Swal.fire({
            title: "Success!",
            text: response.data.message || "Property outcome has been added.",
            icon: "success",
        });

        // Return the created property data (optional)
        return response.data.property;
    } catch (error) {
        // Handle errors and show error message
        console.error("CREATE PROPERTY ERROR:", error);
        Swal.fire({
            title: "Failed to Create Property Information",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        throw error; // Re-throw the error for further handling if necessary
    }
}

export async function getAllBudgetOutcomeApi(id) {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_ALL_BUDGET_OUTCOME}/${id}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Budget Outcome",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY OWNER ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Owner",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}
export async function getBudgetOutcomeApi() {
    let result = [];
    try {
        const response = await apiConnector("GET", `${GET_BUDGET_OUTCOME}`);
        if (!response?.data?.success) {
            await Swal.fire({
                title: "Failed to Fetch Budget Outcome",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        result = response.data.properties;
        return result;
    } catch (error) {
        console.log("FETCH PROPERTY OWNER ERROR............", error);
        Swal.fire({
            title: "Failed to Fetch Property Owner",
            text: error.response?.data?.message || "Something went wrong, please try again later.",
            icon: "error",
        });
        return result;
    }
}


export const deleteBudgetOutComeApi = async (id) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_BUDGET_OUTCOME}/${id}`);
        if (!response?.data?.success) {
            Swal.fire({
                title: "Delete Failed",
                text: response.data.message,
                icon: "error",
            });
            throw new Error(response.data.message);
        }
        Swal.fire({
            title: "Deleted",
            text: " Budget Outcome deleted successfully!",
            icon: "success",
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Something went wrong. Try again later.",
            icon: "error",
        });
        return false;
    }
};