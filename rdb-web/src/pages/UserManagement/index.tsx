import React, { useState } from 'react';
import { Row, Col, Input, Button, Divider, Popover, Popconfirm, message, Tooltip, Alert, Form, Table, Modal } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { PaginatedParams } from '@umijs/hooks/lib/useFormTable'
import { useFormTable } from '@umijs/hooks'
import clipboard from '@pkgs/clipboard';
import request from '@pkgs/request';
import api from '@pkgs/api';
import { defaultPageSizeOptions } from '@pkgs/config'
import { UserProfile } from '@interface';
import CreateUser from './CreateUser';
import ModifyUser from './ModifyUser';
import Activation from './Activation';
import ResetPassword from './ResetPassword';
import { Status, Type } from './Config';

interface Result {
  total: number;
  list: UserProfile[];
}

interface Props {
  form: WrappedFormUtils;
}

const ButtonGroup = Button.Group;

const getTableData = ({ current, pageSize }: PaginatedParams[0], formData: Object): Promise<Result> => {
  let query = `p=${current}&limit=${pageSize}`;
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      query += `&${key}=${value}`
    }
  });
  return request(`${api.user}s?${query}`).then((res) => {
    return res;
  });
};

function UserList(props: Props & WrappedComponentProps) {
  const [inviteTooltipVisible, setInviteTooltipVisible] = useState(false);
  const [invitePopoverVisible, setInvitePopoverVisible] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copySucceeded, setCopySucceeded] = useState(false);
  const { tableProps, search, refresh } = useFormTable(getTableData, {
    defaultPageSize: 10,
    form: props.form,
  });
  const handleInviteBtnClick = () => {
    request(`${api.users}/invite`).then((res) => {
      const { origin } = window.location;
      const inviteLink = `${origin}/register?token=${res}`;
      const newCopySucceeded = clipboard(inviteLink);

      setCopySucceeded(newCopySucceeded);
      setInviteLink(inviteLink);
      setInviteTooltipVisible(false);
      setInvitePopoverVisible(true);
    });
  };
  const handleAddBtnClick = () => {
    CreateUser({
      language: props.intl.locale,
      onOk: () => {
        refresh();
      },
    });
  };
  const handlePutPassBtnClick = (id: number, pwd_expires_at: number) => {
    ResetPassword({
      language: props.intl.locale,
      id,
      pwd_expires_at,
      onOk: () => {
        refresh();
      },
    });
  };
  const handlePutBtnClick = (record: UserProfile) => {
    ModifyUser({
      language: props.intl.locale,
      data: record,
      onOk: () => {
        refresh();
      },
    });
  };

  const handlePutModalClick = (record: UserProfile, status: number) => {
    request(`${api.user}/${record.id}/profile`, {
      method: 'PUT',
      body: JSON.stringify({
        ...record,
        status: status
      }),
    }).then(() => {
      refresh();
      message.success('success');
    });
  }

  const handleActivationClick = (record: UserProfile) => {
    Activation({
      language: props.intl.locale,
      data: record,
      onOk: () => {
        refresh();
      },
    });
  }

  const handleStatusClick = (record: UserProfile) => {
    switch (record.status) {
      case 0: Modal.confirm({
        title: '禁用用户',
        content: '禁用用户后，该用户将无法登录。确定禁用用户吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() { handlePutModalClick(record, 1) }
      });
        break;
      case 1: Modal.confirm({
        title: '启用用户',
        content: '启用用户后，该用户将可以登录。确定启用用户吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() { handlePutModalClick(record, 0) }
      });
        break;
      case 2: Modal.confirm({
        title: '解锁用户',
        content: '该用户因多次输入密码错误被锁定，解锁后该用户将可以登录。确定解锁用户吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() { handlePutModalClick(record, 0) }
      });
        break;
    }
  }
  const handleDelBtnClick = (id: number) => {
    request(`${api.user}/${id}`, {
      method: 'DELETE',
    }).then(() => {
      refresh();
      message.success(props.intl.formatMessage({ id: 'msg.delete.success' }));
    });
  }
  const columns: ColumnProps<UserProfile>[] = [
    {
      title: <FormattedMessage id="user.username" />,
      dataIndex: 'username',
    }, {
      title: <FormattedMessage id="user.dispname" />,
      dataIndex: 'dispname',
      width: 70
    }, {
      title: '组织',
      dataIndex: 'organization',
    }, {
      title: <FormattedMessage id="user.email" />,
      dataIndex: 'email',
    }, {
      title: <FormattedMessage id="user.phone" />,
      dataIndex: 'phone',
      width: 120
    }, {
      title: 'IM',
      dataIndex: 'im',
    }, {
      title: <FormattedMessage id="user.leader" />,
      dataIndex: 'leader_name',
      width: 100
    }, {
      title: <FormattedMessage id="user.isroot" />,
      dataIndex: 'is_root',
      width: 100,
      render: (text) => {
        if (text) {
          return <FormattedMessage id="yes" />;
        }
        return <FormattedMessage id="no" />;
      },
    }, {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (text: any | number) => Type[text] ? Type[text] : text,
    }, {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (text: any | number) => Status[text] ? Status[text] : text,
    }, {
      title: <FormattedMessage id="table.operations" />,
      width: 220,
      render: (_text, record) => {
        return (
          <span style={{ display: 'flex', flexDirection: 'row' }}>
            {
              record.status === 0 || record.status === 1 ?
                <span>
                  <a onClick={() => { handlePutPassBtnClick(record.id, record.pwd_expires_at); }}><FormattedMessage id="user.reset.password" /></a>
                  <Divider type="vertical" />
                  <a onClick={() => { handlePutBtnClick(record); }}><FormattedMessage id="table.modify" /></a>
                  <Divider type="vertical" />
                </span> : null
            }
            {
              record.status === 0 ? <a onClick={() => { handleStatusClick(record); }}>禁用</a> :
                record.status === 1 ? <a onClick={() => { handleStatusClick(record); }}>启用</a> :
                  record.status === 2 ? <a onClick={() => { handleStatusClick(record); }}>解锁</a> :
                    record.status === 3 ? <a onClick={() => { handleActivationClick(record); }}>激活</a> :
                      null
            }
            { record.status !== undefined && record.status !== 4 ? <Divider type="vertical" /> : null}
            <Popconfirm title={<FormattedMessage id="table.delete.sure" />} onConfirm={() => { handleDelBtnClick(record.id); }}>
              <a className="danger-link"><FormattedMessage id="table.delete" /></a>
            </Popconfirm>
          </span>
        );
      },
    }
  ];
  return (
    <div>
      <Row>
        <Col span={8} className="mb10">
          <Form>
            {props.form.getFieldDecorator('query')(
              <Input.Search placeholder="请输入用户名" style={{ width: 240 }} onSearch={search.submit} />,
            )}
          </Form>
        </Col>
        <Col span={16} className="textAlignRight">
          <ButtonGroup>
            <Button onClick={handleAddBtnClick}><FormattedMessage id="table.create" /></Button>
            <Popover
              trigger="click"
              placement="topRight"
              visible={invitePopoverVisible}
              onVisibleChange={(visible) => {
                if (!visible) {
                  setInvitePopoverVisible(visible);
                }
              }}
              content={
                copySucceeded ?
                  <Alert message={<FormattedMessage id="copy.success" />} type="success" /> :
                  <Alert message={
                    <div>
                      <p><FormattedMessage id="copy.faile" /></p>
                      <span>{inviteLink}</span>
                    </div>
                  } type="warning" />
              }
            >
              <Tooltip
                placement="topRight"
                visible={inviteTooltipVisible}
                onVisibleChange={(visible) => { setInviteTooltipVisible(visible); }}
                title={<FormattedMessage id="user.invite.tips" />}
              >
                <Button className="ml10" onClick={handleInviteBtnClick}><FormattedMessage id="user.invite" /></Button>
              </Tooltip>
            </Popover>
          </ButtonGroup>
        </Col>
      </Row>
      <Table
        columns={columns}
        rowKey="id"
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
          showTotal: (total) => {
            if (props.intl.locale === 'zh') {
              return `共 ${total} 条数据`;
            }
            if (props.intl.locale === 'en') {
              return `Total ${total} items`;
            }
            return null;
          },
          pageSizeOptions: defaultPageSizeOptions,
        }}
      />
    </div>
  );
}

export default Form.create()(injectIntl(UserList));
