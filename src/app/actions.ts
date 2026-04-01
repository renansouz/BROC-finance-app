'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addTransaction(formData: FormData) {
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  
  const type = amount < 0 ? 'EXPENSE' : 'INCOME'

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

  await prisma.transaction.createMany({
    data: transactions.map(t => ({
      description: t.description,
      amount: t.amount,
      type: t.amount < 0 ? 'EXPENSE' : 'INCOME',
      date: new Date(),
      accountId: account!.id
    }))
  })

  revalidatePath('/')
}