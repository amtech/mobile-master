/**
 * 劳动合同审批 相关API
 */
import { httpApi } from '../http/reduxRequestMiddleware';

/*
* 审批单申请详情
* personId  ApplicationID  ApplicationTypeID  method:"GetReNewApproveDetail"
*
* 审批
* method：ApproveRenew
* personID：当前审批人的personID
* ApplicationID:详情链接中的ApplicaitonID
* ApplicationTypeID：详情链接中的申请单类型 0正式工或合同工，1实习生
* ApproveType：详情链接中的申请单类型   E员工确认 M经理审批（推待办的时候传入）
* ApproveStatus: 0审批拒绝，1审批通过，2转聘申请,3员工主动离职
* ApproveRemark：审批意见
* EndDateTime：经理审批实习生续签合同经理必填的时间
* encryptedstr：personID+"_"+key+"_"+ApplicationID+"_"+key+"_"+ApplicationTypeID拼到一起用可以MD5加密传入
* 入参限制：
* 当ApproveType ：M, ApplicationTypeID：1，ApproveStatus ：1，EndDateTime必须传入。
* 当ApproveType ：M，ApproveStatus ：0，ApproveRemark必须传入
* */

export const labourDetail = (param) => ({
  [httpApi]: {
    url: `/AICMSWebServices/MobileApproverUrl.ashx`,
    options: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: param,
    },
    types: ['GET_LABOUR_DETAIL_SUCCESS'],
  },
})

