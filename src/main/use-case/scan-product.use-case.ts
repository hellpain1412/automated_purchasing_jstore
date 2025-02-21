import { DETAIL_URL, SEARCH_URL } from "@/common/constant";
import { net } from "electron";
import * as cheerio from "cheerio";

export interface Product {
  id?: string;
  name?: string;
  url?: string;
  price?: string;
  productId?: string;
  link?: string;
  status?: string;
  buyAt?: Date;
}

export class ScanProductUseCase {
  async execute(keyword?: string, page?: number) {
    const url = this.generateSearchURL(keyword, page);
    try {
      const rawData = await this.getRawData(url);
      return this.parseData(rawData);
    } catch (error) {
      throw error;
    }
  }

  parseData(rawData: string) {
    const products: Product[] = [];
    try {
      const $ = cheerio.load(rawData);
      $("#r_searchList ul.innerList li .detail").each((index, e) => {
        let name = $(e).find(".name a");
        let price = $(e).find(".price_ .price_");
        products.push({
          name: name ? name.text() : "",
          url: name ? DETAIL_URL + name.attr("href") : "",
          price: price ? price.text()?.match(/\d+/g)?.join("") : "",
        });
      });
    } catch (error) {
      throw error;
    }

    return products;
  }

  async getRawData(url: string) {
    const response = await net.fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.text()) || "";
    return data;
  }

  generateSearchURL(keyword?: string, page?: number) {
    const searchParams = {
      page: page || 1,
      search: keyword || "mezz",
      sort: "price_desc",
      money1: "",
      money2: "",
      prize1: "",
      company1: "",
      content1: "",
      originalcode1: "",
      category: "",
      subcategory: "",
    };
    const url = new URL(SEARCH_URL);
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.append(key, value?.toString() || "");
    });

    return url.href;
  }
}
