import { MEMBER_ROLE, PLATINUM_ROLE, RESELLER_ROLE } from "@/common/interfaces/user";
import prisma from "@/lib/prisma";

export async function PriceCheck({
  productId,
  price
}: {
  productId: number,
  price: number
}): Promise<{
  finalPrice: number;
  platinumPrice: number;
  resellerPrice: number;
  regularPrice: number;
}> {
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    }
  });
  
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  // Base price
  const basePrice = price;
  
  let regularPrice = basePrice;
  if (product.isRegularProfitPercentage) {
    regularPrice += (basePrice * Number(product.profitRegular)) / 100;
  } else {
    regularPrice += Number(product.profitRegular || 0);
  }
  
  // Calculate platinum price
  let platinumPrice = basePrice;
  if (product.isPlatinumProfitPercentage) {
    platinumPrice += (basePrice * Number(product.profitPlatinum)) / 100;
  } else {
    platinumPrice += Number(product.profitPlatinum || 0);
  }
  
  // Calculate standard price
  let finalPrice = basePrice;
  if (product.isProfitPercentage) {
    finalPrice += (basePrice * Number(product.profit)) / 100;
  } else {
    finalPrice += Number(product.profit || 0);
  }
  
  // Calculate reseller price
  let resellerPrice = basePrice;
  if (product.isResellerProfitPercentage) {
    resellerPrice += (basePrice * Number(product.profitReseller)) / 100;
  } else {
    resellerPrice += Number(product.profitReseller || 0);
  }
  
  return {
    finalPrice: Math.round(finalPrice),
    platinumPrice: Math.round(platinumPrice),
    resellerPrice: Math.round(resellerPrice),
    regularPrice: Math.round(regularPrice)
  };
}

export async function PriceTransactions(role: string, productCode: string) {
  const product = await prisma.product.findUnique({
    where: {
      providerId: productCode
    }
  });
  
  if (!product) {
    return {
      status: false,
      code: 404,
      message: "Product Not Found"
    };
  }
  
  let profit = 0;
  let price = Number(product.price || 0);
  let finalPrice = price;
  
  if (role === PLATINUM_ROLE) {
    if (product.isPlatinumProfitPercentage) {
      profit = (price * Number(product.profitPlatinum || 0)) / 100;
    } else {
      profit = Number(product.profitPlatinum || 0);
    }
  } else if (role === RESELLER_ROLE) {
    if (product.isResellerProfitPercentage) {
      profit = (price * Number(product.profitReseller || 0)) / 100;
    } else {
      profit = Number(product.profitReseller || 0);
    }
  } else if (role === MEMBER_ROLE) {
    if (product.isRegularProfitPercentage) {
      profit = (price * Number(product.profitRegular || 0)) / 100;
    } else {
      profit = Number(product.profitRegular || 0);
    }
  } else {
    if (product.isProfitPercentage) {
      profit = (price * Number(product.profit || 0)) / 100;
    } else {
      profit = Number(product.profit || 0);
    }
  }
  
  
  return {
    price: finalPrice,
    profit,
    status  : true
  }
}