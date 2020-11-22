import api from '@pkgs/api';

export const getDate = async (tenant: number) => {
    const response =  await fetch(api.zstack + '/' + tenant + '/usages')
    const data = await response.json()
    if(response.status < 200 || response.status >= 300){
      console.log(data.err);
    }
    return data;
  };