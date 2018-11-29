import { httpApi } from '../http/reduxRequestMiddleware';


export const borrowInfo = (borrowId, proId) => ({
  [httpApi]: {
    url: `Contract/ajax/getMobileBorrowBean.action?borrowId=${borrowId}&processId=${proId}`,
    options: {
      method: 'GET',
      version: 'none', // 无版本号
    },
    types: ['GET_BORROW_INFO_SUCCESS'],
  },
})

/*
* personId  审批人personId
* borrowId  申请单ID
* processId  节点ID
* approveState （1同意，2拒绝）
* rejectReason 审批意见
* */
export const borrowApprove = (pid, bid, proid, state, remark) => ({
  [httpApi]: {
    url: `Contract/ajax/approvalPactBorrow.action?personId=${pid}&borrowId=${bid}&processId=${proid}&approveState=${state}&rejectReason=${remark}`,
    options: {
      method: 'GET',
      version: 'none', // 无版本号
    },
    types: ['GET_BORROW_APPROVE_SUCCESS'],
  },
})