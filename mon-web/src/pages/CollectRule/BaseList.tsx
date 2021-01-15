import React from "react";
import { Form, Input, Icon, Col, Row } from "antd";
import { useDynamicList } from "@umijs/hooks";

interface IParams {
  data: {
    name: string;
    label: string;
    description: string;
    required: true;
    type: string;
  };
  getFieldDecorator: any;
  initialValues: any;
}

export default (props: IParams) => {
  const { name, description, required, label } = props.data;
  const { list, remove, getKey, push } = useDynamicList(props?.initialValues?.[name] || ['123']);
  const Rows = (index: number, item: any) => (
    <Row key={`${name}[${getKey(index)}]`}>
      <Form.Item key={name} label={label === "Command" ? label : ""}>
        {console.log("initialValues", props?.initialValues?.[name])}
        {console.log("item", item)}
        {props.getFieldDecorator(`${name}[${getKey(index)}]`, {
          // initialValue: props?.initialValues?.[name],
          initialValue:item,
          rules: [
            {
              required,
              message: description,
            },
          ],
        })(
          <Col span={22}>
            <Input placeholder="请输入！" />
          </Col>
        )}
        {list.length > 1 && (
          <Col span={1}>
            <Icon
              type="minus-circle-o"
              style={{ marginLeft: 8 }}
              onClick={() => {
                remove(index);
              }}
            />
          </Col>
        )}
        <Col span={1}>
          <Icon
            type="plus-circle-o"
            style={{ marginLeft: 8 }}
            onClick={() => {
              push("");
            }}
          />
        </Col>
      </Form.Item>
    </Row>
  );
  return <>{list.map((ele: any, index: any) => Rows(index, ele))}</>;
};
