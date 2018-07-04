
    import React from 'react';
    import { Icon } from 'antd';

    export const PageConfig = {
      name: '分组设置',
      path: 'category',
      tableColumns: [{
        title: 'ID',
        dataIndex: 'id',
      }, {
        title: '商品分组名称',
        dataIndex: 'cname',
      }, {
        title: '商品数量',
        dataIndex: 'productCount',
        sorter: (a, b) => a.productCount - b.productCount
      },  {
        title: '序号',
        dataIndex: 'corder',
        sorter: (a, b) => a.corder - b.corder
      },{
        title: '创建时间',
        dataIndex: 'createdTime',
        sorter: (a, b) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime()
      }, {
        title: '修改时间',
        dataIndex: 'updatedTime',
        sorter: (a, b) => new Date(a.updatedTime).getTime() - new Date(b.updatedTime).getTime()
      }],
      searchForms: [{
        formType: 'input',
        disabled: false,
        isRequired: false,
        key: 'cname',
        label: '分组名称',
        placeholder: '分组名称',
      }
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
        key: 'parentId',
        label: 'parentId',
        initialValue:0,
        colSpan: 0,
      }, {
        formType: 'input',
        disabled: false,
        isRequired: true,
        key: 'cname',
        label: '分组名称',
        placeholder: '分组名称',
        colSpan: 24,
      }, 
      {
        formType: 'inputNumber',
        disabled: false,
        isRequired: false,
        key: 'corder',
        label: '序号',
        placeholder: '序号',
        colSpan: 24,
      },],
    };

  