import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const webhookToken = searchParams.get("token")

    if (webhookToken !== process.env.WEBHOOK_SECRET_TOKEN) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { description, amount, date, integrationKey } = body // <-- Agora recebemos a key

    const integration = await prisma.integration.findUnique({
      where: { apiKey: integrationKey },
      include: { financialAccount: true }
    })

    if (!integration) {
      return NextResponse.json({ error: "Chave de integração inválida" }, { status: 404 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type: parseFloat(amount) < 0 ? 'EXPENSE' : 'INCOME',
        date: new Date(date),
        userId: integration.userId,
        financialAccountId: integration.financialAccountId, 
      },
    })

    return NextResponse.json({ success: true, id: transaction.id })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}