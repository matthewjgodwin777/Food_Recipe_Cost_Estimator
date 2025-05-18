const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const utility = require("../utils/utility");

const STORE_HOME_PAGE="https://www.bigbasket.com";
const jar = new CookieJar();

async function fetchCookies() {
    const response = await axios.get(STORE_HOME_PAGE, { jar, withCredentials: true, headers: {
            "Accept": "*/*",
            "Cache-Control": "no-cache",
            "Host": "www.bigbasket.com",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
        } }
    )
    const setCookieHeaders = response.headers["set-cookie"];
    if (setCookieHeaders) {
        setCookieHeaders.forEach((cookie) => {
            jar.setCookieSync(cookie, STORE_HOME_PAGE); //Add cookies to the jar
        });
    }
    return setCookieHeaders;
}

async function fetchItemDetails(itemName, setCookieHeaders, filteredList, qtyVal, unit){
    const response = await axios.get("https://www.bigbasket.com/listing-svc/v2/products?type=ps&slug="+encodeURIComponent(itemName)+"&page=1", { jar, withCredentials: true, headers: {
        "Accept": "*/*",
        "Cache-Control": "no-cache",
        "Host": "www.bigbasket.com",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Cookie": setCookieHeaders
    } })

    let rsp = response.data.tabs[0].product_info.products[0];
    for(let i=0; i<response.data.tabs[0].product_info.products.length; i++){
        let tempUnit = response.data.tabs[0].product_info.products[i].unit;
        if(utility.equalsIgnoreCase(tempUnit, "ml")
            || utility.equalsIgnoreCase(tempUnit, "L")
            || utility.equalsIgnoreCase(tempUnit, "mg")
            || utility.equalsIgnoreCase(tempUnit, "g")
            || utility.equalsIgnoreCase(tempUnit, "kg")) {
            rsp = response.data.tabs[0].product_info.products[i];
            break;
        }
    }
    const itemDetails = {
        name: rsp.desc,
        desc: rsp.pack_desc,
        count: utility.getActualQuantity(rsp.pack_desc),
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

async function fetchItemDetailsList(nameList, filteredList, qtyList, unitList){
    const setCookieHeaders = await fetchCookies();
    
    console.log("Number of Cookies in jar:", jar.getCookiesSync(STORE_HOME_PAGE).length); // Log cookies

    for (let i = 0; i < nameList.length; i++) {
        console.log("Fetching details for item:", nameList[i]);
        await fetchItemDetails(nameList[i], setCookieHeaders, filteredList, qtyList[i], unitList[i]);
    }
}

module.exports = {
    fetchItemDetailsList
};