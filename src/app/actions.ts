'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { identifyCategory } from "@/services/categorizer"
import { auth } from "@/auth"

export async function addTransaction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Não autorizado")

  const userId = session.user.id
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const date = new Date(formData.get('date') as string)
  const financialAccountId = formData.get('financialAccountId') as string
  
  const manualCategoryId = formData.get('categoryId') as string

  const categoryId = manualCategoryId || await identifyCategory(description, userId)

  await prisma.transaction.create({
    data: {
      description,
      amount,
      type: amount < 0 ? 'EXPENSE' : 'INCOME',
      date,
      financialAccountId,
      categoryId: categoryId || null, 
      userId
    }
  })

  revalidatePath('/')
}

export async function importTransactions(
  transactions: { description: string, amount: number, date: Date }[], 
  financialAccountId: string
) {
  const session = await auth()
  if (!session?.user?.id) return
  const userId = session.user.id

  const rules = await prisma.descriptionRule.findMany({
    where: { userId }
  })

  const transactionsWithDetails = await Promise.all(
    transactions.map(async (t) => {
      // 2. Aplica a regra de nome se existir
      const rule = rules.find(r => r.originalText === t.description)
      const cleanDescription = rule ? rule.cleanedText : t.description

      return {
        description: cleanDescription,
        amount: t.amount,
        type: t.amount < 0 ? 'EXPENSE' : 'INCOME',
        date: new Date(t.date),
        financialAccountId: financialAccountId,
        categoryId: await identifyCategory(cleanDescription, userId), // Identifica categoria pelo nome limpo
        userId: userId
      }
    })
  )

  await prisma.transaction.createMany({
    data: transactionsWithDetails
  })

  revalidatePath('/')
}

export async function updateTransactionCategory(transactionId: string, categoryId: string) {
  const session = await auth()
  if (!session?.user?.id) return

  const transaction = await prisma.transaction.update({
    where: { id: transactionId, userId: session.user.id },
    data: { categoryId: categoryId }
  })

  const ruleText = transaction.description.split(' ').slice(0, 2).join(' ').toLowerCase();

  await prisma.categoryRule.upsert({
    where: {
      userId_text: {
        userId: session.user.id,
        text: ruleText
      }
    },
    update: { categoryId: categoryId },
    create: {
      userId: session.user.id,
      text: ruleText,
      categoryId: categoryId
    }
  })

  revalidatePath('/')
}

export async function upsertBudget(
  categoryId: string, 
  amount: number, 
  month: number, 
  year: number,
  allYear: boolean 
) {  
  const session = await auth()
  if (!session?.user?.id) return
  const userId = session.user.id

  const monthsToUpdate = allYear 
    ? Array.from({ length: 13 - month }, (_, i) => month + i) 
    : [month]

  for (const m of monthsToUpdate) {
    await prisma.budget.upsert({
      where: {
        userId_categoryId_month_year: {
          userId,
          categoryId,
          month: m,
          year
        }
      },
      update: { amount },
      create: {
        userId,
        categoryId,
        amount,
        month: m,
        year
      }
    })
  }

  revalidatePath('/')
  revalidatePath('/settings')

}

export async function addFinancialAccount(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const limit = formData.get('limit') ? parseFloat(formData.get('limit') as string) : null
  const closingDay = formData.get('closingDay') ? parseInt(formData.get('closingDay') as string) : null
  const dueDay = formData.get('dueDay') ? parseInt(formData.get('dueDay') as string) : null

  await prisma.financialAccount.create({
    data: {
      name,
      type,
      limit,
      closingDay,
      dueDay,
      userId: session.user.id
    }
  })

  revalidatePath('/accounts')
  revalidatePath('/')
}

export async function addAsset(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const value = parseFloat(formData.get('value') as string)

  await prisma.asset.create({
    data: {
      name,
      type,
      value,
      userId: session.user.id
    }
  })

  revalidatePath('/settings')
  revalidatePath('/')
}

export async function addLiability(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const totalAmount = parseFloat(formData.get('totalAmount') as string)

  await prisma.liability.create({
    data: {
      name,
      type,
      totalAmount,
      userId: session.user.id
    }
  })

  revalidatePath('/')
  revalidatePath('/settings')
}

export async function addBill(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const name = formData.get('name') as string
  const amount = parseFloat(formData.get('amount') as string)
  const dueDay = parseInt(formData.get('dueDay') as string)

  await prisma.bill.create({
    data: {
      name,
      amount,
      dueDay,
      userId: session.user.id
    }
  })

  revalidatePath('/')
}

export async function saveOnboarding(data: any) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: { 
      ...data, 
      isOnboardingComplete: true 
    },
    create: { 
      userId: session.user.id, 
      ...data, 
      isOnboardingComplete: true 
    }
  })

  revalidatePath('/dashboard')
}

export async function deleteTransaction(id: string) {
  const session = await auth()
  if (!session?.user?.id) return
  await prisma.transaction.delete({ where: { id, userId: session.user.id } })
  revalidatePath('/')
}

export async function updateTransactionDescription(id: string, newDescription: string) {
  const session = await auth()
  if (!session?.user?.id) return
  
  const original = await prisma.transaction.findUnique({ where: { id } })
  if (!original) return
  
  await prisma.transaction.update({
    where: { id },
    data: { description: newDescription }
  })
  
  await prisma.descriptionRule.upsert({
    where: {
      userId_originalText: { userId: session.user.id, originalText: original.description }
    },
    update: { cleanedText: newDescription },
    create: { userId: session.user.id, originalText: original.description, cleanedText: newDescription }
  })

  revalidatePath('/')
}

export async function updateDescriptionAndLearn(id: string, newDescription: string) {
  const session = await auth()
  if (!session?.user?.id) return

  const transaction = await prisma.transaction.update({
    where: { id, userId: session.user.id },
    data: { description: newDescription }
  })

  await prisma.descriptionRule.upsert({
    where: { userId_originalText: { userId: session.user.id, originalText: transaction.description } },
    update: { cleanedText: newDescription },
    create: { userId: session.user.id, originalText: transaction.description, cleanedText: newDescription }
  })

  revalidatePath('/')
}