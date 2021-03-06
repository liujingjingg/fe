import React, { useEffect, useState } from 'react';
import request from '@pkgs/request';
import api from '@common/api';
import LiquCharts from './LiquCharts';
import './style.less';
import { Spin } from 'antd';

interface IUsageStat {
  usageStat: any,
  loading: boolean
}


const UsageStat = (props: IUsageStat) => {
  const [usageData, setUsageData] = useState({} as any);
  const [volumeData, setVolumeData] = useState({} as any);


  const fetchData = async () => {
    try {
      const dat = await request(props.usageStat?.api)
      setUsageData(dat);
    } catch (e) {
      console.log(e);
    }
  }

  const fetchVolumeData = async () => {
    try {
      const dat = await request(api.volume)
      setVolumeData(dat)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchVolumeData();
  }, [])

  useEffect(() => {
    fetchData();
  }, [props.usageStat?.api])

  const UsageStat = [
    {
      ident: 'zstack', // 3408 多云
      name: '计算',
      children: [
        {
          name: '弹性云服务器',
          unit: '台',
          total: usageData?.instanceTotal,
          children: [{ used: usageData?.cpuUsed, total: usageData?.cpuTotal, unit: '核', label: 'CPU用量' },
          { used: usageData?.memUsed, total: usageData?.memTotal, unit: 'GB', label: '内存用量' },
          { used: usageData?.volumeUsed, total: usageData?.volumeTotal, unit: 'GB', label: '云硬盘用量' }]
        },
        {
          name: '裸金属服务器',
          unit: '台',
          total: usageData?.baremetalTotal,
          children: [{ used: usageData?.baremetalCpuUsed, total: usageData?.baremetalCpuTotal, unit: '核', label: 'CPU用量' },
          { used: usageData?.baremetalMemUsed, total: usageData?.baremetalMemTotal, unit: 'GB', label: '内存用量' },
          { used: usageData?.baremetalVolumeUsed, total: usageData?.baremetalVolumeTotal, unit: 'GB', label: '云硬盘用量' }]
        }],
      api: '/zstack/v1/cmp/dashboard/manager/capacity/used',
    }, {
      ident: 'dstore', // 3398 对象存储
      name: '存储',
      children: [{
        name: '云硬盘',
        unit: '个',
        total: volumeData?.volumeNum,
        children: [{ used: volumeData?.volumeUsed, total: volumeData?.volumeTotal, unit: 'GB', label: '存储空间用量' }]
      }, {
        name: '对象存储',
        unit: '个',
        total: usageData?.instance_running_num,
        children: [{ used: usageData?.disk_used, total: usageData?.disk_capacity, unit: 'GB', label: '存储空间用量' }]
      }],
      api: '/api/screen/view/dstore/res'
    }, {
      ident: 'db', // 3400
      name: '数据库',
      children: [{
        name: '数据库MySQL版',
        unit: '台',
        total: usageData[0]?.instance_running_num,
        children: [{ used: usageData[0]?.cpu_used, total: usageData[0]?.cpu_capacity, unit: '核', label: 'CPU用量' },
        { used: usageData[0]?.mem_used, total: usageData[0]?.mem_capacity, unit: 'GB', label: '内存用量' },
        { used: usageData[0]?.disk_used, total: usageData[0]?.disk_capacity, unit: 'GB', label: '云硬盘用量' }]
      },
      {
        name: '数据库MongoDB版',
        unit: '台',
        total: usageData[2]?.instance_running_num,
        children: [{ used: usageData[2]?.cpu_used, total: usageData[2]?.cpu_capacity, unit: '核', label: 'CPU用量' },
        { used: usageData[2]?.mem_used, total: usageData[2]?.mem_capacity, unit: 'GB', label: '内存用量' },
        { used: usageData[2]?.disk_used, total: usageData[2]?.disk_capacity, unit: 'GB', label: '云硬盘用量' }]
      },
      {
        name: '数据库Redis版',
        unit: '台',
        total: usageData[1]?.instance_running_num,
        children: [{ used: usageData[1]?.cpu_used, total: usageData[1]?.cpu_capacity, unit: '核', label: 'CPU用量' },
        { used: usageData[1]?.mem_used, total: usageData[1]?.mem_capacity, unit: 'GB', label: '内存用量' },
        { used: usageData[1]?.disk_used, total: usageData[1]?.disk_capacity, unit: 'GB', label: '云硬盘用量' }]
      }],
      api: '/api/screen/view/db/res',
    }, {
      ident: 'ccp', // 3402
      name: '容器',
      children: [{
        name: '容器',
        unit: '个',
        total: usageData?.instance_running_num,
        children: [{ used: usageData?.cpu_used, total: usageData?.cpu_capacity, unit: '核', label: 'CPU用量' },
        { used: usageData?.mem_used, total: usageData?.mem_capacity, unit: 'GB', label: '内存用量' },
        { used: usageData?.disk_used, total: usageData?.disk_capacity, unit: 'GB', label: '云硬盘用量' }]
      }],
      api: '/api/screen/view/ccp/res',
    },
  ];
  return (<>

    <div>{
      UsageStat.map((item: any, index: number) => {
        if (item.api === props.usageStat?.api) {
          return <div className='usageStat' key={index}>
            {item.children.map((item: any, index: number) => (
              <div className='usageStat-border' key={index}>
                <div className='usageStat-border-title'>
                  <p>{item.name}</p>
                  <p>已使用 <span style={{ color: '#3370FF' }}>{item.total}</span> {item.unit}</p>
                </div>
                <div className='usageStat-border-liqu'>
                  {item?.children?.map((item: any, index: number) => (
                    props.loading ? <Spin key={index} /> :
                      <div key={index} style={{ width: '30%' }}>
                        <LiquCharts data={item.used / item.total} color={item?.color} />
                        <p style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{item.label}</p>
                        <p>已使用：{item.used}{item.unit}</p>
                        <p>总量：{item.total}{item.unit}</p>
                      </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        }
      })
    }</div>
  </>)
}

export default UsageStat;
