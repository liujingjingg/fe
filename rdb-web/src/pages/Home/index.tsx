import React, { useEffect, useState } from "react";
import { Table } from "antd";
import api from "@common/api";
import request from "@pkgs/request";
import { levelMaps } from "./config";
import { announcements } from "./request";
import moment from "moment";
import "./style.less";

const arr = [
  "弹性云",
  "弹性云",
  "弹性云",
  "弹性云",
  "弹性云",
  "弹性云",
  "弹性云",
  "弹性云",
];

const SaaS = ["近1日告警数", "近7日告警数", "近30日告警数"];

const Home = (props: any) => {
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const [HistoryList, setHistoryList] = useState([] as any);
  const [dislocationData, setDislocationData] = useState({} as any);
  const [user, setUser] = useState({} as any);
  const [announcement, setAnnouncement] = useState([] as any);
  const [list, setList] = useState([] as any);

  const reqData = {
    stime: timestamp - 259200,
    etime: timestamp,
    limit: 10,
    p: 1,
    nodepath: "inner.monitor.monitor",
  };
  const userIconSrc = require("./avatars.png");

  useEffect(() => {
    const menusHistory = localStorage.getItem("menusHistory");
    let defaultHistory = [];
    try {
      defaultHistory = JSON.parse(menusHistory || "");
    } catch (e) {
      console.log(e);
    }

    if (defaultHistory.length) {
      setHistoryList(defaultHistory);
    }
    getDate();
    selftProfile();
    announcements().then((res) => {
      setAnnouncement(res);
    });
  }, []);
  useEffect(() => {
    if (announcement) {
      setList(announcement);
    }
  }, [announcement]);

  const columns = [
    {
      title: "策略名称",
      dataIndex: "sname",
      key: "sname",
      width: 100,
    },
    {
      title: "级别",
      dataIndex: "category",
      render: (text: any | string) =>
        levelMaps[text] ? levelMaps[text] : text,
      width: 60,
    },
    {
      title: "Endpoint",
      dataIndex: "endpoint",
      key: "endpoint",
    },
    {
      title: "发生时间",
      dataIndex: "created",
      width: 180,
      render: (text: any) => {
        return moment(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "操作",
      key: "address",
      render: (text: string, record: string) => <span>...</span>,
    },
  ];

  const selftProfile = async () => {
    try {
      const info = await request(api.selftProfile);
      setUser(info);
    } catch (e) {
      console.log(e);
    }
  };

  const getDate = async () => {
    try {
      const data = await request(
        `${api.cur}` +
          "?etime=" +
          reqData.etime +
          "&limit=" +
          reqData.limit +
          "&stime=" +
          reqData.stime +
          "&p=" +
          reqData.p +
          "&nodepath=" +
          reqData.nodepath
      );
      setDislocationData(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="console-home">
      <div className="console-home-visitors">
        <p className="console-home-visitors-p">最近访问</p>
        <div>
          {HistoryList.map((item: any, index: number) => {
            return (
              <a
                href={`/${item.path}`}
                key={index}
                className="console-home-visitors-list"
              >
                <svg aria-hidden="true" className="console-home-visitors-icon">
                  <use xlinkHref={item.icon}></use>
                </svg>
                <span className="console-home-visitors-name">{item.name}</span>
              </a>
            );
          })}
        </div>
      </div>
      <div className="console-home-document">
        <p className="console-home-visitors-p">我的资源</p>
        <a
          className="console-home-visitors-a"
          href="/mon/history/cur"
          style={{ marginLeft: "79%" }}
        >
          查看更多
        </a>
        <div>
          {arr.map((item: string, index: number) => {
            return (
              <div key={index} className="console-home-visitors-list">
                {item}
              </div>
            );
          })}
        </div>
      </div>
      <div className="console-home-SaaS">
        <p className="console-home-visitors-p">监控告警</p>
        <div className="console-home-SaaS-div">
          {SaaS.map((item: string, index: number) => {
            return (
              <a
                key={index}
                className="console-home-SaaS-list"
                href="/mon/history/cur"
              >
                {item}
              </a>
            );
          })}
        </div>
      </div>
      <div className="console-home-dislocation">
        <p className="console-home-visitors-p">未恢复告警</p>
        <a className="console-home-visitors-a" href="/mon/history/cur">
          查看更多
        </a>
        <div className="console-home-dislocation-table">
          <Table
            columns={columns}
            scroll={{ y: 110 }}
            dataSource={dislocationData?.list}
            pagination={false}
          />
        </div>
      </div>
      <div className="console-home-user">
        <img src={userIconSrc} alt="用户" className="console-home-user-img" />
        <div className="console-home-user-info">
          <span className="console-home-user-info-name">{user?.username}</span>
          <br />
          <span className="console-home-user-info-other">
            所属机构 : {user?.dispname}
          </span>
          <br />
          <span className="console-home-user-info-other">
            手机号 :{user?.phone}
          </span>
          <br />
          <span className="console-home-user-info-other">
            邮箱 :{user?.email}
          </span>
        </div>
        <div className="console-home-user-wait">待办工单</div>
      </div>
      <div className="console-home-announcement">
        <p className="console-home-visitors-p">最新公告</p>
        <a
          className="console-home-visitors-a"
          href="/portal/home/notice/"
          style={{ marginLeft: "50%" }}
        >
          查看更多
        </a>
        <div>
          {list.map((item: any, index: number) => {
            const month = moment(item.createdAt).format("MM");
            const day = moment(item.createdAt).format("DD");
            return (
              <div className="console-home-announcement-content">
                <a key={index} href={"/portal/home/notice/" + item.id}>
                  <div className="console-home-announcement-data">
                    <span className="console-home-announcement-month">
                      {month}月
                    </span>
                    <span className="console-home-announcement-day">{day}</span>
                  </div>
                  <div className="console-home-announcement-title">
                    {item.title}
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
