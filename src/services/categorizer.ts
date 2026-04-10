import prisma from "@/lib/prisma";

const CATEGORY_RULES: Record<string, string> = {
  'uber': 'Transporte',
  '99app': 'Transporte',
  'ifood': 'Alimentação',
  'mercado': 'Alimentação',
  'supermercado': 'Alimentação',
  'restaurante': 'Alimentação',
  'netflix': 'Lazer',
  'spotify': 'Lazer',
  'aluguel': 'Moradia',
  'condominio': 'Moradia',
  'luz': 'Contas Fixas',
  'internet': 'Contas Fixas',
};

export async function identifyCategory(description: string) {
  const descLower = description.toLowerCase();

  const keyword = Object.keys(CATEGORY_RULES).find(key => descLower.includes(key));

  if (keyword) {
    const categoryName = CATEGORY_RULES[keyword];

    let category = await prisma.category.findFirst({
      where: { name: categoryName }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName }
      });
    }

    return category.id;
  }

  return null;
}