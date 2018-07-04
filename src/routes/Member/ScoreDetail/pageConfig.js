
    import React from 'react';
    import { Icon } from 'antd';

    export const PageConfig = {
      name: '积分记录',
      path: 'member/scoredetail/:id',
      tableColumns: [ {
        title: '姓名',
        dataIndex: 'name',
      }, {
        title: '领取渠道',
        dataIndex: 'remark',
      }, {
        title: '积分',
        dataIndex: 'changeScore',
      }, {
        title: '日期',
        dataIndex: 'createdTime',
      },],
      searchForms: [{
        formType: 'select',
        disabled: false,
        isRequired: false,
        key: 'type',
        label: '领取渠道',
        dataType: 'static',
        selectOptions: [
          {
            "key": 1,
            "value": "分享"
          },
          {
            "key": 2,
            "value": "活动"
          }
        ],
      }, {
        formType: 'rangePicker',
        disabled: false,
        isRequired: false,
        key: 'date',
        label: '日期',
        placeholder: '请选择日期',
      }
      ],
      detailFormItems: [],
    };

  