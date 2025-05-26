import axios, { AxiosHeaderValue } from "axios";
import { CookieJar } from "tough-cookie";
import {
    equalsIgnoreCase,
    getActualQuantity,
    hasIngredientSubstringWithUnit
} from "../utils/utility";
import { Item } from "../models/zodSchemas";
import { EXPECTED_UNIT_EXCEPTIONS, STORE_HOME_PAGE, STORE_SEARCH_ITEM_URL } from "../config/constants";

const jar = new CookieJar();

async function fetchCookies() {
    const response = await axios.get(STORE_HOME_PAGE, { withCredentials: true, headers: {
            "Accept": "*/*",
            "Cache-Control": "no-cache",
            "Host": "www.bigbasket.com",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
        } }
    )
    const setCookieHeaders: string[] = response.headers["set-cookie"] as string[];
    if (setCookieHeaders) {
        setCookieHeaders.forEach((cookie) => {
            jar.setCookieSync(cookie, STORE_HOME_PAGE); //Add cookies to the jar
        });
    }
    return setCookieHeaders;
}

async function fetchItemDetails(itemName: string, setCookieHeaders: AxiosHeaderValue, filteredList: Item[], qtyVal: number, unit: string){
    const response = await axios.get(STORE_SEARCH_ITEM_URL.replace("@ITEM_NAME@", itemName), { withCredentials: true, headers: {
        "Accept": "*/*",
        "Cache-Control": "no-cache",
        "Host": "www.bigbasket.com",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Cookie": setCookieHeaders
    } })

    let rsp = response.data.tabs[0].product_info.products[0];
    for(let i=0; i<response.data.tabs[0].product_info.products.length; i++){
        let tempName = response.data.tabs[0].product_info.products[i].desc;
        let tempUnit = response.data.tabs[0].product_info.products[i].unit;
        if(equalsIgnoreCase(tempUnit, "ml")
            || equalsIgnoreCase(tempUnit, "L")
            || equalsIgnoreCase(tempUnit, "mg")
            || equalsIgnoreCase(tempUnit, "g")
            || equalsIgnoreCase(tempUnit, "kg")
            || hasIngredientSubstringWithUnit(
                EXPECTED_UNIT_EXCEPTIONS,
                tempName,
                tempUnit)) {
            rsp = response.data.tabs[0].product_info.products[i];
            break;
        }
    }
    const itemDetails: Item = {
        name: rsp.desc,
        desc: rsp.pack_desc,
        count: getActualQuantity(rsp.pack_desc),
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

async function fetchItemDetailsList(nameList: string[], filteredList: Item[], qtyList: number[], unitList: string[]){
    const setCookieHeaders = await fetchCookies();
    
    console.log("Number of Cookies in jar:", jar.getCookiesSync(STORE_HOME_PAGE).length); // Log cookies

    for (let i = 0; i < nameList.length; i++) {
        nameList[i]=nameList[i].trim();
        console.log("Fetching details for item:", nameList[i]);
        await fetchItemDetails(nameList[i], setCookieHeaders, filteredList, qtyList[i], unitList[i]);
    }
}

export {
    fetchItemDetailsList
};