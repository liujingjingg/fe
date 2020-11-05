import request from "@pkgs/request";
import api from "@common/api";

export const announcements = async () => {
    try {
      const data = await request(api.announcements + "?limit=5&p=1&kind=1");
      return data?.list;
    } catch (e) {
      console.log(e);
    }
  };