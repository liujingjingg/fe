import React, { useEffect, useState } from 'react';
import { Table, Divider, Modal, Form, Input } from 'antd';
import { getDate } from './request'
// import { parseJSON } from "@pkgs/utils";
import _ from 'lodash';

const renderContent = (value: string, row: number, index: number) => {
    if (index === 1 || index === 3) {
        return {
            children: value,
            props: {
                colSpan: 0
            }
        }
    }
    if (index === 0 || index === 2) {
        return {
            children: value,
            props: {
                rowSpan: 2
            }
        }
    }
    return value;
};


const Usages = (props: any) => {
    const { getFieldDecorator, validateFields } = props.form;
    const [bmsCpu, setBmsCpu] = useState({} as any);
    const [bmsMemorySize, setBmsMemorySize] = useState({} as any);
    const [cmpCPU, setCmpCPU] = useState({} as any);
    const [vmMemorySize, setVmMemorySize] = useState({} as any);
    const [volume, setVolume] = useState({} as any);
    const [visible, setVisible] = useState(false);
    // const [tenantProject, setTenantProject] = useState(
    //     parseJSON(localStorage.getItem("icee-global-tenant") as string)
    // );

    const formItemLayout = {
        labelCol: {
          sm: { span: 8},
        },
        wrapperCol: {
          sm: { span: 8 },
        },
      };

    const columns = [
        {
            title: '服务名称',
            dataIndex: 'name',
            width: 180,
            render: renderContent,
        }, {
            title: '配额项',
            dataIndex: 'username',
            width: 150,
        }, {
            title: '已用配额',
            dataIndex: 'used',
            width: 180,
        }, {
            title: '总配额',
            width: 100,
            dataIndex: 'total',
        }, {
            title: '操作',
            render: (value: string, row: any, index: number) => {
                if (index === 1 || index === 3) {
                    return {
                        props: {
                            colSpan: 0
                        }
                    }
                }
                if (index === 0 || index === 2) {
                    return {
                        children:
                            <span>
                                <a onClick={() => { handleUsages(row) }}>编辑</a>
                                <Divider type="vertical" />
                                <a>重置</a>
                            </span>,
                        props: {
                            rowSpan: 2
                        }
                    }
                }
                return <span>
                    <a onClick={() => { handleUsages(row) }}>编辑</a>
                    <Divider type="vertical" />
                    <a>重置</a></span>;
            }
        },
    ];
    const handleUsages = (row: { key: number, name: string, username: string, used: number, total: number }) => {
        setVisible(true);
        console.log(row)

    }
    const dataSource = [
        {
            key: '1',
            name: '弹性云服务器',
            username: 'CPU数',
            used: cmpCPU.used,
            total: cmpCPU.total,
        },
        {
            key: '2',
            username: '内存（MB）',
            used: vmMemorySize.used,
            total: vmMemorySize.total,
        },

        {
            key: '3',
            name: '裸金属服务器',
            username: 'CPU数',
            used: bmsCpu.used,
            total: bmsCpu.total,
        },
        {
            key: '4',
            username: '内存（MB）',
            used: bmsMemorySize.used,
            total: bmsMemorySize.total,
        },
        {
            key: '5',
            name: '云硬盘',
            username: '容量(GB)',
            used: volume.used,
            total: volume.total,
        },
    ];

    const oncancel = () => {
        setVisible(false);
    }

    useEffect(() => {
        getDate(2).then((res) => {
            res.usages.map((item: { name: string, used: number, total: number }) => {
                switch (item.name) {
                    case 'bms.cpuNum':
                        setBmsCpu(item);
                        break;
                    case 'bms.memorySize':
                        setBmsMemorySize(item);
                        break;
                    case 'vm.cpuNum':
                        setCmpCPU(item);
                        break;
                    case 'vm.memorySize':
                        setVmMemorySize(item);
                        break;
                    case 'volume.capacity':
                        setVolume(item);
                        break;
                    default:
                        return;
                }
            })
        })
    }, [])
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={false} />
            <Modal visible={visible} onCancel={oncancel}>
                <Form {...formItemLayout} >
                    <Form.Item label="CPU数">
                        {getFieldDecorator('used', {
                            rules: [
                                {
                                    type: '',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="内存（MB）">
                        {getFieldDecorator('total', {
                            rules: [
                                {
                                    type: '',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                </Form>
            </Modal>
        </div>)
}

export default Form.create()(Usages);

