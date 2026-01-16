import { CompanyModel } from '../../../models/companyModel'

function generateRandomCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function generateUniqueInviteCode(length = 6): Promise<string> {
  let code = ''
  let exists = true

  while (exists) {
    code = generateRandomCode(length)
    const existingCompany = await CompanyModel.findOne({
      where: { companyInviteCode: code }
    })
    exists = !!existingCompany
  }

  return code
}
