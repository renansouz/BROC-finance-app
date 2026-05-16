import prisma from "@/lib/prisma";

const STATIC_RULES: Record<string, string> = {
  'uber': 'Transporte',
  'ifood': 'Alimentação',
  'netflix': 'Lazer',
};

export async function identifyCategory(description: string, userId: string) {
  const descLower = description.toLowerCase();
  const customRule = await prisma.categoryRule.findFirst({
    where: {
      userId,
      text: { contains: descLower, mode: 'insensitive' }
    },
    include: { category: true }
  });

  if (customRule) return customRule.categoryId;

  const keyword = Object.keys(STATIC_RULES).find(key => descLower.includes(key));
  if (keyword) {
    const category = await prisma.category.findFirst({
      where: { name: STATIC_RULES[keyword], userId }
    });
    return category?.id || null;
  }

  return null;  
}