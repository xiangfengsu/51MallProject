
  import React, { PureComponent } from 'react';
  import PropTypes from 'prop-types';
  import { Form, Row, Col, Card,Tag } from 'antd';
  import { renderFormItem } from 'common/formItem';
  import 'rc-color-picker/assets/index.css';
  import ColorPicker from 'rc-color-picker';
  import styles from './Index.less';
  const FormItem = Form.Item;
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };
  @Form.create()
  export default class DetailFormInfo extends PureComponent {
    static contextTypes = {
      updateFormItems: PropTypes.func,
    };
    state = {
      styleColor:'red'
    };
    onSelectChange = (value) => {
      this.context.updateFormItems(value);
    };
    colorChangeHandle = ({color})=>{
      const { form:{ setFieldsValue }} = this.props;
      setFieldsValue({
        style:color
      });
    };
    renderColorPicker = (InputType)=>{
      const { form:{ getFieldValue }} = this.props;
      const color = getFieldValue('style');
      return (
        <Row gutter={16} >
          <Col span={0}>{InputType}</Col>
          <Col span={8}><Tag color={color}>标签样式</Tag></Col>
          <Col span={8}>
            <ColorPicker
              className={styles.test1}
              animation="slide-up"
              color={color}
              onChange={this.colorChangeHandle}
            />
          </Col>
        </Row>
      );
    }
    renderFormItem = () => {
      const { formItems, form } = this.props;
      return formItems.map((item) => {
        if (item.key === 'type') {
          item.onSelect = this.onSelectChange; // eslint-disable-line
        }
        const InputType = renderFormItem(item, form);
        return (
          <Col 
            lg={item.colSpan === 0 ? 0 : item.colSpan || 8}
            md={item.colSpan === 0 ? 0 : 12}
            sm={item.colSpan === 0 ? 0 : 24}
            key={item.key}
          >
            <FormItem
              label={item.label}
              hasFeedback={item.hasFeedback!==undefined?item.hasFeedback:true}
              {...formItemLayout}
              
            >
              {
                item.key === 'style'?this.renderColorPicker(InputType,item.initialValue):InputType
              }
            </FormItem>
          </Col>
        );
      });
    }
    render() {
      return (
        <Card bordered={false} loading={false}>
          <Form>
            <Row gutter={24}>
              {this.renderFormItem()}
            </Row>
          </Form>
        </Card>

      );
    }



  }
  