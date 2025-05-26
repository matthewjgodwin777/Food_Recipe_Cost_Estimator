import {
    RECIPE_FETCH_IMAGE_URL,
    RECIPE_IMAGE_HOST_URL,
    DEFAULT_RECIPE_IMAGE_URL
} from "../config/constants";
import axios from "axios";

/**
 * Fetches the first image src from the HTML body of the recipe page.
 * @param recipe_name The recipe name to append to the RECIPE_IMAGE_URL.
 * @returns The src attribute of the first <img> tag, or null if not found.
 */
export async function getRecipeNameImageSrc(recipe_name: string): Promise<string | null> {
    const url = RECIPE_FETCH_IMAGE_URL.replace("@RECIPE_NAME@",recipe_name);
    try{
        const response = await axios.get(url, { withCredentials: true, headers: {
                "Accept": "*/*",
                "Cache-Control": "no-cache",
                "Host": "www.swiggy.com",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            } }
        );
        const cards = response.data?.data?.cards;
        if (Array.isArray(cards)) {
            for (const outerCard of cards) {
                const groupedCard = outerCard?.groupedCard;
                const dishCards = groupedCard?.cardGroupMap?.DISH?.cards;
                if (Array.isArray(dishCards)) {
                    for (const innerCard of dishCards) {
                        let imageId: string = innerCard?.card?.card?.info?.imageId;
                        if (imageId && (imageId.endsWith(".jpg") || imageId.endsWith(".jpeg")
                            || imageId.endsWith(".png") || imageId.endsWith(".webp"))) {
                            return RECIPE_IMAGE_HOST_URL+imageId;
                        }
                    }
                }
            }
        }
        //console.log("Card: "+response.data.data.cards[1].groupedCard.cardGroupMap.DISH.cards[1].card.card.info.imageId);
        
    } catch (e: any) {
        console.error("Error fetching image for recipe. Using default image : "+e);
    }
    return process.env.BASE_URL + DEFAULT_RECIPE_IMAGE_URL;
}