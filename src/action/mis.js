/*
 * mis业务审批接口
 */
import { httpApi } from '../http/reduxRequestMiddleware';

/*
* key xxe7b*jw
* method：GetNTAccountApplicationDetail
* personId：当前登录人
* ApplicationID:详情链接中的ApplicaitonID jw_fb839b10-4d7f-4e90-b471-63f358d7e6e9
* encryptedstr：personID+"_"+key+"_"+ApplicationID+"_"+key拼到一起用可以MD5加密传入
* */

export const getMisInfo = (param) => ({
  [httpApi]: {
    url: `AIOAS_API/AIOASGetApplicationDetails.ashx`,
    options: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      version: 'none', // 无版本号
      body: param,
    },
    types: ['GET_MIS_INFO_SUCCESS'],
  },
})

/*
 * 审批
 * 1. SystemID (系统标识)
 * 2. ApplicationID (申请单ID)
 * 3. ApplicationProcessID (审批步骤ID)
 * 4. ApproverID (当前审批人ID)
 * 5. ApproveResult (审批结果)
 * 6.RejectReason (拒绝原因)
 * 7.IsAgentApprove (是否代理审批)
 * */

export const misApprove = (param) => ({
  [httpApi]: {
    url: `AIOAS_API/AIAcceptOrReject.aspx?${param}`,
    options: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      version: 'none', // 无版本号
      // body: param,
    },
    types: ['APPROVE_MIS_SUCCESS'],
  },
})