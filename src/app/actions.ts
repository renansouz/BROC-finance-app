'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { identifyCategory } from "@/services/categorizer"

export async function addTransaction(formData: FormData) {
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  
  const type = amount < 0 ? 'EXPENSE' : 'INCOME'
  const categoryId = await identifyCategory(description)

  let account = await prisma.account.findFirst()
  if (!account) {
    account = await prisma.account.create({
      data: { name: 'Conta Principal', type: 'Checking' }
    })
  }

  await prisma.transaction.create({
    data: {
      description,
      amount,
      type,
      date: new Date(),
      accountId: account.id,
      categoryId: categoryId 
    }
  })

  revalidatePath('/')
}

export async function importTransactions(transactions: { description: string, amount: number }[]) {
  let account = await prisma.account.findFirst()
  if (!account) {
    account = await prisma.account.create({ 
      data: { name: 'Conta Principal', type: 'Checking' } 
    })
  }

  const transactionsWithCategories = await Promise.all(
    transactions.map(async (t) => ({
      description: t.description,
      amount: t.amount,
      type: t.amount < 0 ? 'EXPENSE' : 'INCOME',
      date: new Date(),
      accountId: account!.id,
      categoryId: await identifyCategory(t.description) 
    }))
  )

  await prisma.transaction.createMany({
    data: transactionsWithCategories
  })

  revalidatePath('/')
}

export async function updateTransactionCategory(transactionId: string, categoryId: string) {
  await prisma.transaction.update({
    where: { id: transactionId },
    data: { categoryId: categoryId }
  })

  revalidatePath('/')
}