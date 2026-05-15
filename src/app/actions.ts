'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { identifyCategory } from "@/services/categorizer"
import { auth } from "@/auth"

export async function addTransaction(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Você precisa estar logado para adicionar transações.")
  }

  const userId = session.user.id
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  
  const type = amount < 0 ? 'EXPENSE' : 'INCOME'
  const categoryId = await identifyCategory(description)

  let financialAccount = await prisma.financialAccount.findFirst({
    where: { userId: userId }
  })

  if (!financialAccount) {
    financialAccount = await prisma.financialAccount.create({
      data: { 
        name: 'Conta Principal', 
        type: 'Checking',
        userId: userId 
      }
    })
  }

  await prisma.transaction.create({
    data: {
      description,
      amount,
      type,
      date: new Date(),
      financialAccountId: financialAccount.id,
      categoryId: categoryId,
      userId: userId 
    }
  })

  revalidatePath('/')
}

export async function importTransactions(transactions: { description: string, amount: number }[]) {
  const session = await auth()
  if (!session?.user?.id) return

  const userId = session.user.id

  let financialAccount = await prisma.financialAccount.findFirst({
    where: { userId: userId }
  })

  if (!financialAccount) {
    financialAccount = await prisma.financialAccount.create({ 
      data: { name: 'Conta Principal', type: 'Checking', userId: userId } 
    })
  }

  const transactionsWithCategories = await Promise.all(
    transactions.map(async (t) => ({
      description: t.description,
      amount: t.amount,
      type: t.amount < 0 ? 'EXPENSE' : 'INCOME',
      date: new Date(),
      financialAccountId: financialAccount!.id,
      categoryId: await identifyCategory(t.description),
      userId: userId 
    }))
  )

  await prisma.transaction.createMany({
    data: transactionsWithCategories
  })

  revalidatePath('/')
}

export async function updateTransactionCategory(transactionId: string, categoryId: string) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.transaction.update({
    where: { 
      id: transactionId,
      userId: session.user.id 
    },
    data: { categoryId: categoryId }
  })

  revalidatePath('/')
}