// const baseURL = "http://192.168.130.141:8080/"
const baseURL = "http://localhost:8080/"

export const RestURL = {

    ResponseType: {
        JSON: "json",
        TEXT: "text",
        BOLO: "blob",
    },

    Path: {
        getUser         : baseURL + "user/get",
        getAllProduct   : baseURL + "products/all",
        getImage        : baseURL + "products/image/",
        getProduct      : baseURL + "products/get/",
        getCategories   : baseURL + "products/categories",
        getFilltered    : baseURL + "products/filltered",
        placeOrder      : baseURL + "products/order",
        getPayment      : baseURL + "products/payment",
        getOrderInfo    : baseURL + "products/order/info/",

        login           : baseURL + "user/attempt/login",
        getToken        : baseURL + "user/get/token",
        updateUser      : baseURL + "user/update",
        addToCart       : baseURL + "user/addToCart",
        updateDeliveryInfo  : baseURL + "user/deliveryInfo/update",
        deleteDeliveryInfo  : baseURL + "user/deliveryInfo/delete/",
        graphQuery      : baseURL + "graphql",

        addProduct      : baseURL + "seller/product/add"
    },

    isAuthorized: {
        user    : baseURL + "user/",
        seller  : baseURL + "seller/product/",
        token   : [baseURL + "products/order", baseURL + "graphql"]
    }
}