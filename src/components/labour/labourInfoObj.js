export default function labourInfo(param) {
  let applicationInfo = {}, approveInfo = {}, contractInfo= {}
  Object.assign(contractInfo, {
    type: 'contract',
    ONSITE_LAST_NAME: '合同续签联系人',
    ONSITE_PHONE_NUMBER: '电话',
    ONSITE_EMAIL_ADDRESS: '邮箱',
    ONSITE_ADDRESS: '地址',
    BP_LAST_NAME: '政策咨询人',
    BP_MOBILE: '电话',
    BP_EMAIL_ADDRESS: 'E-mail',
  })
  if (param.IS_SHOW_YXRJ === '0') {
    // 其他bg
    Object.assign(applicationInfo, {
      type: 'application',
      LAST_NAME: '姓名',
      EMPLOYEE_NUMBER: '编号',
      EMPLOYEE_TYPE: '聘用形式',
      ORG_MANAGER_NAME: '经理',
      ORGANIZATION_NAME: '部门',
      COSTCENTER_NAME: '成本中心',
      COMPANY_NAME: '公司',
      REGION_NAME: '发薪地',
      WORKING_LOCATION: '实际工作地',
      BENEFIT_LOCATION: '福利地',
      JOB_FAMILY: '族群',
      SECOND_JOB_FAMILY: '序列',
      JOB_ROLE: '角色',
      LEVEL: '职级',
      LEVEL_CLASS : '层级级别',
      LEVEL_NAME : '层级名程',
      BAND: 'Band',
      MOBILE: '手机号',
      EMAIL_ADDRESS: 'E-mail',
    })
  } else if (param.IS_SHOW_YXRJ === '1') {
    // 亚信科技
    Object.assign(applicationInfo, {
      type: 'application',
      LAST_NAME: '姓名',
      EMPLOYEE_NUMBER: '编号',
      EMPLOYEE_TYPE: '聘用形式',
      ORG_MANAGER_NAME: '经理',
      ORGANIZATION_NAME: '部门',
      COSTCENTER_NAME: '成本中心',
      COMPANY_NAME: '公司',
      REGION_NAME: '发薪地',
      WORKING_LOCATION: '实际工作地',
      BENEFIT_LOCATION: '福利地',
      JOB_FAMILY: '族',
      SECOND_JOB_FAMILY: '类',
      SUB_SECOND_JOB_FAMILY: '子类',
      JOB_ROLE: '岗位',
      ROUTE: '通道',
      LEVEL: '层级',
      LEVEL_CLASS : '层级级别',
      LEVEL_NAME : '层级名程',
      LEVEL_GRADE: '层级分档',
      MOBILE: '手机号',
      EMAIL_ADDRESS: 'E-mail',
    })
  }
  switch (param.APPLICATION_TYPE_ID)
  {
    case '0':
      // 正式工
      Object.assign(approveInfo, {
        type: 'approve',
        CONTRACT_END: '合同到期日',
        new_contract_start_date: '新合同开始时间',
        new_contract_end_date: '新合同结束时间',
        CONTRACT_DES: '合同续签说明',
      })
      break;
    case '1':
      // 实习生
      Object.assign(approveInfo, {
        type: 'approve',
        EMPLOYEE_TYPE: '聘用形式',
        CONTRACT_END: '协议到期日',
        new_contract_start_date: '新合同开始时间',
        new_contract_end_date: '新合同结束时间',
        GRADUATION_DATE: '毕业日期',
      })
      break;
    default:
      break;
  }
  return [applicationInfo, approveInfo, contractInfo]
}