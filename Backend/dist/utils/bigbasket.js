"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchItemDetailsList = fetchItemDetailsList;
const axios_1 = __importDefault(require("axios"));
const tough_cookie_1 = require("tough-cookie");
const utility_1 = require("../utils/utility");
const constants_1 = require("../config/constants");
const jar = new tough_cookie_1.CookieJar();
async function fetchCookies() {
    const response = await axios_1.default.get(constants_1.STORE_HOME_PAGE, { withCredentials: true, headers: {
            "Accept": "*/*",
            "Cache-Control": "no-cache",
            "Host": "www.bigbasket.com",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
        } });
    const setCookieHeaders = response.headers["set-cookie"];
    if (setCookieHeaders) {
        setCookieHeaders.forEach((cookie) => {
            jar.setCookieSync(cookie, constants_1.STORE_HOME_PAGE); //Add cookies to the jar
        });
    }
    return setCookieHeaders;
}
async function fetchItemDetails(itemName, setCookieHeaders, filteredList, qtyVal, unit) {
    const response = await axios_1.default.get(constants_1.STORE_SEARCH_ITEM_URL.replace("@ITEM_NAME@", itemName), { withCredentials: true, headers: {
            "Accept": "*/*",
            "Cache-Control": "no-cache",
            "Host": "www.bigbasket.com",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Cookie": setCookieHeaders
        } });
    let rsp = response.data.tabs[0].product_info.products[0];
    for (let i = 0; i < response.data.tabs[0].product_info.products.length; i++) {
        let tempName = response.data.tabs[0].product_info.products[i].desc;
        let tempUnit = response.data.tabs[0].product_info.products[i].unit;
        if ((0, utility_1.equalsIgnoreCase)(tempUnit, "ml")
            || (0, utility_1.equalsIgnoreCase)(tempUnit, "L")
            || (0, utility_1.equalsIgnoreCase)(tempUnit, "mg")
            || (0, utility_1.equalsIgnoreCase)(tempUnit, "g")
            || (0, utility_1.equalsIgnoreCase)(tempUnit, "kg")
            || (0, utility_1.hasIngredientSubstringWithUnit)(constants_1.EXPECTED_UNIT_EXCEPTIONS, tempName, tempUnit)) {
            rsp = response.data.tabs[0].product_info.products[i];
            break;
        }
    }
    const itemDetails = {
        name: rsp.desc,
        desc: rsp.pack_desc,
        count: (0, utility_1.getActualQuantity)(rsp.pack_desc),
        quantity: rsp.magnitude,
        quantity_unit: rsp.unit,
        mrp: rsp.pricing.discount.mrp,
        selling_price: rsp.pricing.discount.prim_price.sp,
        image_url: rsp.images[0].m,
        actual_required_qty: qtyVal,
        actual_required_unit: unit,
        total_cost_at_mrp: 0.0,
        actual_cost: 0.0,
        unit_conversion_issues: false
    };
    filteredList.push(itemDetails);
    console.log("Response received for item ", itemName, " : ", itemDetails);
}
async function fetchItemDetailsList(nameList, filteredList, qtyList, unitList) {
    const setCookieHeaders = await fetchCookies();
    console.log("Number of Cookies in jar:", jar.getCookiesSync(constants_1.STORE_HOME_PAGE).length); // Log cookies
    for (let i = 0; i < nameList.length; i++) {
        nameList[i] = nameList[i].trim();
        console.log("Fetching details for item:", nameList[i]);
        await fetchItemDetails(nameList[i], setCookieHeaders, filteredList, qtyList[i], unitList[i]);
    }
}
