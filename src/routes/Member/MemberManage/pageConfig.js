
    import React from 'react';
    import { Icon,Avatar,Tag } from 'antd';

    export const PageConfig = {
      name: 'test页',
      path: 'table-test',
      tableColumns: [{
        title: '微信号',
        dataIndex: 'openid',
      },{
        title: '头像',
        dataIndex: 'head',
        render:(text)=>{
          return <Avatar src={text} size='large' />
        }
      }, {
        title: '手机号',
        dataIndex: 'mobile',
      }, {
        title: '标签',  
        dataIndex: 'tagsList',
        render:(text)=>{
          if(Array.isArray(text)){
            return text.map(item=>{
              return <Tag key={item.key} color={item.color}>{item.value}</Tag>
            })
          }else{
            return '';
          }
         
        }
      }, {
        title: '积分',
        dataIndex: 'score',
      }, {
        title: '加入时间',
        dataIndex: 'createdTime',
      }],
      searchForms: [{
        formType: 'inputRange',
        disabled: false,
        isRequired: false,
        key: 'score',
        label: '会员积分',
        rangeTypes:[{
          formType: 'inputNumber',
          disabled: false,
          isRequired: false,
          key: 'scoremin',
          placeholder:'最小积分'
        },{
          formType: 'inputNumber',
          disabled: false,
          isRequired: false,
          key: 'scoremax',
          placeholder:'最大积分'
        }]
      }, {
        formType: 'selectDynamic',
        disabled: false,
        isRequired: false,
        key: 'tagId',
        label: '会员标签',
        dataType: 'dynamic',
        dictionaryKey: 'membertags',
        fetchUrl: '/member/membertagentity/getDic',
      },
      {
        formType: 'input',
        disabled: false,
        isRequired: false,
        key: 'openid',
        label: '微信号'
      },
      {
        formType: "inputPhone",
        disabled: false,
        isRequired: false,
        key: "mobile",
        label: "手机号"
      }
      ],
      detailFormItems: [ {
        formType: 'selectDynamic',
        multiple: true,
        disabled: false,
        isRequired: false,
        key: 'tags',
        label: '会员标签',
        dataType: 'dynamic',
        dictionaryKey: 'membertags',
        fetchUrl: '/member/membertagentity/getDic',
        colSpan: 24,

      },],
      personalFormItems:[{
        formType: 'input',
        disabled: true,
        isRequired: false,
        key: 'id',
        label: 'id',
        colSpan:0
      },{
        formType: 'input',
        disabled: false,
        isRequired: true,
        key: 'name',
        label: '姓名',
        colSpan: 24,
      },{
        formType: "inputPhone",
        disabled: false,
        isRequired: false,
        key: "mobile",
        label: "手机号",
        colSpan: 24,
      },{
        formType: "radioGroup",
        disabled: false,
        isRequired: false,
        key: "sex",
        label: "性别",
        options:[{
          label:'男',
          value:1
        },{
          label:'女',
          value:0
        },{
          label:'保密',
          value:2
        }],
        initialValue:1,
        hasFeedback:false,
        colSpan: 24,
      },{
        formType: "datePicker",
        disabled: false,
        isRequired: false,
        key: "birthday",
        label: "生日",
        colSpan: 24,
      },{
        formType: "textArea",
        disabled: false,
        isRequired: false,
        key: "address",
        label: "地址",
        colSpan: 24,
      },]
    };

  