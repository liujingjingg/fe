import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Modal, Form, Input, message, Popconfirm } from 'antd';
import { getDate, updateQuota } from './request';
import { renderContent } from './config';
import { FormComponentProps } from 'antd/lib/form';
import { ModalWrapProps } from '@pkgs/ModalControl';
// import { parseJSON } from "@pkgs/utils";
import _ from 'lodash';

interface usages {
    name: string,
    nameServer: string,
    used: number,
    total: number,
    username: string
}

const Usages = (props: ModalWrapProps & FormComponentProps ) => {
    const table = useRef<any>();
    const { getFieldDecorator } = props.form;
    const [bmsCpu, setBmsCpu] = useState({} as any);
    const [bmsMemorySize, setBmsMemorySize] = useState({} as any);
    const [cmpCPU, setCmpCPU] = useState({} as any);
    const [vmMemorySize, setVmMemorySize] = useState({} as any);
    const [volume, setVolume] = useState({} as any);
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState({} as usages);
    // const [tenantProject, setTenantProject] = useState(
    //     parseJSON(localStorage.getItem("icee-global-tenant") as string)
    // );

    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 15 },
    };

    const columns = [
        { title: '服务名称', dataIndex: 'name', width: 180, render: renderContent },
        { title: '配额项', dataIndex: 'username', width: 150 },
        { title: '已用配额', dataIndex: 'used', width: 180 },
        { title: '总配额', width: 100, dataIndex: 'total' },
        {
            title: '操作',
            render: (value: string, row: any,) => {
                return <span>
                    <a onClick={() => { handleUsages(row) }}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm title='重置后该服务各配额项的总配额将被设为”不限“,是否重置' onConfirm={() => {updateQuota('2', record.nameServer,  Number(record.total)); }}>
                        <a className="danger-link">重置</a>
                    </Popconfirm></span>;
            }
        },
    ];
    const handleUsages = (row: usages) => {
        setVisible(true);
        setRecord(row)
    }
    const dataSource = [
        {
            key: '1',
            name: '弹性云服务器',
            username: 'CPU数',
            used: cmpCPU.used,
            total: cmpCPU.total,
            nameServer: 'vm.cpuNum'
        },
        {
            key: '2',
            name: '弹性云服务器',
            username: '内存（MB）',
            used: vmMemorySize.used,
            total: vmMemorySize.total,
            nameServer: 'vm.memorySize'
        },

        {
            key: '3',
            name: '裸金属服务器',
            username: 'CPU数',
            used: bmsCpu.used,
            total: bmsCpu.total,
            nameServer: 'bms.cpuNum'
        },
        {
            key: '4',
            name: '裸金属服务器',
            username: '内存（MB）',
            used: bmsMemorySize.used,
            total: bmsMemorySize.total,
            nameServer: 'bms.memorySize'
        },
        {
            key: '5',
            name: '云硬盘',
            username: '容量(GB)',
            used: volume.used,
            total: volume.total,
            nameServer: 'volume.capacity'
        },
    ];

    const oncancel = () => {
        setVisible(false);
        Modal.destroyAll();
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        props.form.validateFields(async (errors: any, values: any) => {
            if (!errors) {
                try {
                    updateQuota('2', record.nameServer, Number(values.total)).then((res) => {
                        console.log(res)
                        if (res.location !== '') {
                            // window.location.href = res.location;
                        }
                        message.success('修改成功!')
                        Modal.destroyAll();
                    })
                } catch (e) {
                    console.log(e);
                }
                setVisible(false);
            }
        });
    };

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
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                ref={table}
            />
            <Modal visible={visible} onCancel={oncancel} title="编辑配额" onOk={onSubmit} destroyOnClose={true}> 
                <Form {...formItemLayout} onSubmit={onSubmit} >
                    <Form.Item label="总配额">
                        {getFieldDecorator("total", {
                            rules: [{ required: true }],
                        })(<Input placeholder="总配额"></Input>)}
                    </Form.Item>
                </Form>
            </Modal>
        </div>)
}

export default Form.create()(Usages);

