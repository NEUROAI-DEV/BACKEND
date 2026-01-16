import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/requestHandler'
import { IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { CompanyModel } from '../../models/companyModel'
import { SubscriptionModel } from '../../models/subsriptionModel'

export const appInfo = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const company = await CompanyModel.findOne({
      where: {
        deleted: 0,
        companyId: req?.membershipPayload?.membershipCompanyId
      },
      attributes: ['companyName', 'companyIndustry']
    })

    const subscription = await SubscriptionModel.findOne({
      where: {
        deleted: 0,
        subscriptionCompanyId: req?.membershipPayload?.membershipCompanyId
      },
      attributes: ['subscriptionPlanName', 'subscriptionStatus']
    })

    const data = {
      ...company?.dataValues,
      ...subscription?.dataValues,
      isMaintenance: false,
      maintenanceMessage: ''
    }

    const response = ResponseData.success({ data })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
