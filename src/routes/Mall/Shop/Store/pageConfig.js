
    import React from 'react';
    import { Icon } from 'antd';

    export const PageConfig = {
      name: '门店管理',
      path: 'store',
      tableColumns: [{
        title: '店铺名称',
        dataIndex: 'name',
      }, {
        title: '详细地址',
        dataIndex: 'address',
      }, {
        title: '联系电话',
        dataIndex: 'mobile',
      }],
      searchForms: [{
        formType: 'input',
        disabled: false,
        isRequired: false,
        key: 'name',
        label: '店铺名称'
      }, 
      ],
      detailFormItems: [{
        formType: 'input',
        disabled: false,
        isRequired: true,
        key: 'id',
        label: 'id',
        initialValue:-1,
        colSpan: 0,
      },{
        formType: 'input',
        disabled: false,
        isRequired: true,
        key: 'name',
        label: '店铺名称',
        colSpan: 24,
      }, {
        formType: 'upload',
        disabled: false,
        isRequired: true,
        key: 'picUrl',
        label: '店铺图片',
        action: '/sys/file/upload',
        multiple: true,
        acceptType: 'image/*', // .jpg,.png,.pdf,.mp4,.gif,.word
        listType: 'picture-card', // 1:text  2:picture 3:picture-card
        maxFileSize: 10, // 单位是M
        maxFileCounts: 5,
        hasFeedback:false,
        colSpan: 24,
      },{
        formType: 'inputPhone',
        disabled: false,
        isRequired: true,
        key: 'mobile',
        label: '联系电话',
        colSpan: 24,
      },{
        formType: 'input',
        disabled: false,
        isRequired: true,
        key: 'address',
        label: '店铺地址',
        colSpan: 24,
      },],
    };

  