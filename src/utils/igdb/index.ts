import axios from "axios";
import { defaultFields } from "./constants";
import { ApiResponse, IGDBReturnDataType, InfoReturn } from "./types";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

let instance: IGDB | null = null;

class IGDB {
  private clientId: string = TWITCH_CLIENT_ID ?? "";
  private clientSecret: string = TWITCH_CLIENT_SECRET ?? "";
  private clientAccessToken?: string;
  private tokenExpiration: number = 0;

  private gettingAccessToken = false;

  constructor() {
    if (!instance) instance = this;
    return instance;
  }

  async getAccessToken() {
    if (this.gettingAccessToken) return;
    if (this.clientAccessToken && Date.now() < this.tokenExpiration) {
      return this.clientAccessToken;
    }

    this.gettingAccessToken = true;

    try {
      const response = await axios.post(
        `https://id.twitch.tv/oauth2/token`,
        null, // Axios requires a body for POST, `null` is needed here
        {
          params: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "client_credentials",
          },
        }
      );

      console.log(`Getting a new access token`);

      this.clientAccessToken = response.data.access_token;
      this.tokenExpiration = Date.now() + response.data.expires_in * 1000; // Convert to milliseconds
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw new Error("Failed to fetch Twitch access token.");
    } finally {
      this.gettingAccessToken = false;
    }

    return this.clientAccessToken;
  }

  checkAndRenewToken = async () =>
    !!(Date.now() >= this.tokenExpiration - 100) &&
    (await this.getAccessToken());

  async search(query: string): Promise<IGDBReturnDataType[]> {
    const data = await this.request<IGDBReturnDataType[]>("games", {
      search: query,
    });

    return data;
  }

  async info(id: string): Promise<InfoReturn> {
    const igdbData = await this.request<IGDBReturnDataType[]>("games", {
      where: `id = ${id}`,
      limit: "1",
    });

    const item = igdbData[0];

    const find_steam_id = (item.websites ?? [])?.find((site) =>
      site.url.startsWith("https://store.steampowered.com/app")
    );

    const steam_id = find_steam_id?.url.split("/").pop();

    const steam = steam_id ? await this.steamStoreInfo(steam_id) : null;

    const returnData: InfoReturn = {
      ...item,
      steam,
    };

    return returnData;
  }

  async mostAnticipated(): Promise<IGDBReturnDataType[]> {
    const DateNow = (new Date().getTime() / 1000).toFixed();
    return await this.request<IGDBReturnDataType[]>("games", {
      sort: "hypes desc",
      where: `platforms.abbreviation = "PC" & hypes != n & first_release_date > ${DateNow} & category = 0`,
    });
  }

  async newReleases(): Promise<IGDBReturnDataType[]> {
    const DateNow = (new Date().getTime() / 1000).toFixed();
    return await this.request<IGDBReturnDataType[]>("games", {
      sort: "first_release_date desc",
      where: `platforms.abbreviation = "PC" & hypes != n & first_release_date < ${DateNow} & category = 0 & version_parent = null`,
    });
  }

  async topRated(): Promise<IGDBReturnDataType[]> {
    return await this.request<IGDBReturnDataType[]>("games", {
      sort: "total_rating desc",
      where: `platforms.abbreviation = "PC" & total_rating != n & total_rating > 85 & hypes > 2 & rating_count > 5 & version_parent = null & category = 0`,
    });
  }

  private async request<T = unknown>(
    reqUrl: "games",
    options: {
      fields?: string[];
      where?: string;
      search?: string;
      sort?: string;
      limit?: string;
      offset?: string;
    }
  ): Promise<T> {
    while (this.gettingAccessToken) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    try {
      await this.checkAndRenewToken();

      let requestBody = "";
      const fields = options.fields || [];
      requestBody += `fields ${[...fields, ...defaultFields].join(",")};`;

      if (options.sort) {
        requestBody += ` sort ${options.sort};`;
      }
      if (options.limit) {
        requestBody += ` limit ${options.limit};`;
      }
      if (options.search) {
        requestBody += ` search "${options.search}";`;
      }
      if (options.where) {
        requestBody += ` where ${options.where};`;
      }

      const response = await axios.post(
        `https://api.igdb.com/v4/${reqUrl}`,
        requestBody,
        {
          headers: {
            "Client-ID": this.clientId,
            Authorization: `Bearer ${this.clientAccessToken}`,
            "Content-Type": "text/plain",
          },
        }
      );

      return response.data as T;
    } catch (error) {
      console.error("Error fetching data from IGDB:", error);
      throw new Error(`Failed to fetch data: ${(error as Error).message}`);
    }
  }

  async steamStoreInfo(appid: string) {
    try {
      const url = `https://store.steampowered.com/api/appdetails/?appids=${appid}`;
      const response = await axios.get<ApiResponse>(url);

      return response.data[appid];
    } catch (error) {
      console.error("Error fetching Steam store info:", error);
      throw new Error("Failed to fetch Steam data.");
    }
  }
}

export { IGDB };
