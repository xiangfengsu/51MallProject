
    import React from 'react';
    import { Icon,Tag ,Badge} from 'antd';

    export const PageConfig = {
      name: '商品管理',
      path: 'shopmanage',
      tableColumns: [ {
        title: '图片',
        dataIndex: 'picUrl',
        render:(picList)=>{
          if(picList.length!==0){
            return <img src={picList[0].url} width='60' height='40'/>
          }else{
            return ''
          }
        }
      },{
        title: '商品信息',
        dataIndex: 'name',
        render:(text,record)=>{
          return (
            <div style={{textAlign:'left'}}>
              <div style={{color:'rgba(0, 0, 0, 0.85)'}}>{record.name}</div>
              <div style={{color:'rgba(0,0,0,.65)'}}>商品编码：{record.pcode}</div>
            </div>
          )
        }
      }, {
        title: '分组',
        dataIndex: 'categoryList',
        render:(text)=>{
          return text.map(item=>{
            return <Tag key={item.key} >{item.value}</Tag>
          })
        }
      }, {
        title: '价格',
        dataIndex: 'sellPrice',
        sorter: (a, b) => a.sellPrice - b.sellPrice
      }, {
        title: '库存',
        dataIndex: 'pstock',
        sorter: (a, b) => a.pstock - b.pstock
      }, {
        title: '销量',
        dataIndex: 'sales',
        sorter: (a, b) => a.sales - b.sales
      }, {
        title: '积分',
        dataIndex: 'pscore',
        sorter: (a, b) => a.pscore - b.pscore
      },{
        title: '状态',
        dataIndex: 'status',
        width:'8%',
        render:(text)=>{
          if(text === 1){
            return <Badge status="processing" text="在售" />
          }else{
            return <Badge status="error" text="下架" />
          }
        }
      },{
        title: '排序',
        dataIndex: 'porder',
        sorter: (a, b) => a.porder - b.porder
      },],
      searchForms: [{
        formType: 'input',
        disabled: false,
        isRequired: false,
        key: 'name',
        label: '商品名称',
      }, {
        formType: 'select',
        disabled: false,
        isRequired: false,
        key: 'status',
        label: '商品状态',
        dataType: 'static',
        selectOptions: [{
          key: 1,
          value: '在售',
        }, {
          key: 2,
          value: '下架',
        }],
      }, {
        formType: 'selectDynamic',
        multiple: false,
        disabled: false,
        isRequired: false,
        key: 'category',
        label: '商品分组',
        dataType: 'dynamic',
        dictionaryKey: 'categotyList',
        fetchUrl: '/crm/product/categoty/dic'
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
        label: '商品名称',
        colSpan: 24,
      },{
        formType: 'upload',
        disabled: false,
        isRequired: true,
        key: 'picUrl',
        label: '商品图片',
        action: '/sys/file/upload',
        multiple: true,
        acceptType: 'image/*', // .jpg,.png,.pdf,.mp4,.gif,.word
        listType: 'picture-card', // 1:text  2:picture 3:picture-card
        maxFileSize: 10, // 单位是M
        maxFileCounts: 5,
        hasFeedback:false,
        colSpan: 24,
      },{
        formType: "radioGroup",
        disabled: false,
        isRequired: false,
        key: "attrId",
        label: "商品属性",
        options:[{
          label:'实物商品(物流发货)',
          value:1
        },{
          label:'虚拟商品(无需物流)',
          value:0
        },{
          label:'虚拟商品(自动发货)',
          value:2
        }],
        initialValue:1,
        hasFeedback:false,
        itemColSpan:8,
        colSpan: 24,
      },{
        formType: 'selectDynamic',
        multiple: true,
        disabled: false,
        isRequired: true,
        key: 'category',
        label: '商品分组',
        dataType: 'dynamic',
        dictionaryKey: 'categotyList',
        fetchUrl: '/crm/product/categoty/dic',
        colSpan: 24,
      },{
        formType: 'input',
        disabled: false,
        isRequired: false,
        key: 'pcode',
        label: '商品编码',
        colSpan: 24,
      },{
        formType: 'inputNumber',
        disabled: false,
        isRequired: true,
        key: 'pstock',
        label: '库存总量',
        colSpan: 24,
      },{
        formType: 'inputNumber',
        disabled: false,
        isRequired: true,
        key: 'sellPrice',
        label: '销售价格',
        colSpan: 24,
      },{
        formType: "radioGroup",
        disabled: false,
        isRequired: false,
        key: "status",
        label: "商品状态",
        options:[{
          label:'在售',
          value:1
        },{
          label:'下架',
          value:2
        }],
        initialValue:1,
        hasFeedback:false,
        itemColSpan:8,
        colSpan: 24,
      },{
        formType: 'inputNumber',
        disabled: false,
        isRequired: false,
        key: 'porder',
        label: '商品排序',
        colSpan: 24,
      },{
        formType: 'textArea',
        disabled: false,
        isRequired: false,
        key: 'pdesc',
        label: '商品描述',
        colSpan: 24,
      },{
        formType: 'textArea',
        disabled: false,
        isRequired: false,
        key: 'pintro',
        label: '商品简介',
        colSpan: 24,
      },],
    };

  