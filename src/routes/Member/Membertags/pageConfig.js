
    import React from 'react';
    import { Tag } from 'antd';

    export const PageConfig = {
      name: '标签设置',
      path: 'membertags',
      tableColumns: [{
        title: '标签名称',
        dataIndex: 'name',
        render:(text,record)=>{
          return <Tag color={record.style}>{text}</Tag>;
        }
      }, {
        title: '标签类型',
        dataIndex: 'type',
        render:(text)=>{
          if(text === 0){
            return (
              <span style={{color:'#52c41a'}}>自动标签</span>
            )
          }else{
            return (
              <span style={{color:'#1890ff'}}>手动标签</span>
            )
          }
        }
      }, {
        title: '标签机制',
        dataIndex: 'tagdesc',
        render:(text,record)=>{
          if(record.type === 0){
            return (
              <div style={{fontSize:12}}>
                <p style={{margin:0}}>
                  <span>累计成功交易：</span>
                  <span style={{color:'rgba(0, 0, 0, 0.85)'}}>{record.minAmount} 笔</span>
                </p>
                <p style={{margin:0}}>
                  <span>累计交易金额：</span>
                  <span style={{color:'rgba(0, 0, 0, 0.85)'}}>{record.minTrades} 元</span>
                </p>
              </div>
            );
          }else{
            return '';
          }
        }
      }, {
        title: '会员数',
        dataIndex: 'count',
      },{
        title: '修改时间',
        dataIndex: 'updatedTime',
      }],
      searchForms: [{
        formType: 'input',
        disabled: false,
        isRequired: false,
        key: 'name',
        label: '标签名称',
      }, {
        formType: 'select',
        disabled: false,
        isRequired: false,
        key: 'type',
        label: '标签类型',
        dataType: 'static',
        selectOptions: [{
          key: '0',
          value: '自动分配'
        }, {
          key: '1',
          value: '手动分配'
        }],
      }
      ],
      detailFormItems: [{
        formType: 'input',
        disabled: false,
        isRequired: true,
        key: 'id',
        label: 'id',
        colSpan: 0,
        initialValue:0
      },{
        formType: 'input',
        disabled: false,
        isRequired: true,
        key: 'dealerId',
        label: 'dealerId',
        colSpan: 0,
        initialValue:0
      },{
        formType: 'input',
        disabled: false,
        isRequired: true,
        key: 'name',
        label: '标签名称',
        colSpan: 24,
      },{
        formType: 'select',
        disabled: false,
        isRequired: true,
        dataType: 'static',
        key: 'type',
        selectOptions:[{
          value: "自动",
          key: 0
        },{
          value: "手动",
          key: 1
        }],
        initialValue:0,
        label: '标签类型',
        colSpan: 24,
      },{
        formType: 'input',
        disabled: false,
        isRequired: true,
        key: 'style',
        label: '标签颜色',
        colSpan: 24,
        hasFeedback:false,
        initialValue:'#1890ff'
      },],
    };

  