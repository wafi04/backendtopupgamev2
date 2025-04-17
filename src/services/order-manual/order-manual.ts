import { ConfigEnv } from "@/config/env";

export class OrderManual  {
    private username = ConfigEnv().DIGI_USERNAME as string;
    private DIGI_API_KEY = ConfigEnv().DIGI_API_KEY as string;


}