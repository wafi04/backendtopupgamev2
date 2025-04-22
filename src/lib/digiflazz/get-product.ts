import { sendResponse } from "@/common/utils/response";
import { Digiflazz } from "./digiflazz";
import { Request, Response } from "express";
import { CategoriesRepository } from "@/services/categories/repository/categories";
import prisma from "../prisma";
import { PriceCheck } from "@/services/price-check/price";

export interface ResponseFromDigiflazz {
  product_name: string;
  category: string;
  brand: string;
  type: string;
  seller_name: string;
  price: number;
  buyer_sku_code: string;
  buyer_product_status: boolean;
  seller_product_status: boolean;
  unlimited_stock: boolean;
  stock: number;
  multi: boolean;
  start_cut_off: string;
  end_cut_off: string;
  desc: string;
}

export default async function GetProductFromDigiflazz(req: Request, res: Response) {
  try {
    const digiflazz = new Digiflazz();
    const cat = new CategoriesRepository();
    
    // Dapatkan data produk dari Digiflazz
    const digiResponse = await digiflazz.GetProductList();
    
    // Periksa dan ekstrak array produk dari respons
    let digiProducts = [];
    
    // Cek apakah respons memiliki properti yang berisi array produk
    if (digiResponse && typeof digiResponse === 'object') {
      // Jika respons adalah objek dengan properti data
      if (Array.isArray(digiResponse)) {
        digiProducts = digiResponse;
      } 
      // Tambahkan log untuk debugging
      else {
        console.log("Unexpected response format from Digiflazz:", digiResponse);
        throw new Error("Invalid response format from Digiflazz API");
      }
    } else {
      throw new Error("Invalid response from Digiflazz API");
    }
    
    console.log(`Retrieved ${digiProducts.length} products from Digiflazz`);
    
    const categories = await cat.FilterCategory({
      all: true
    });

    const totalStats = { processed: 0, created: 0, updated: 0 };

    for (const category of categories.categories) {
      if (!category.brand) {
        console.warn(`Category ID ${category.id} has no brand, skipping`);
        continue;
      }

      const categoryStats = { processed: 0, created: 0, updated: 0 };

      for (const item of digiProducts) {
        if (!item || typeof item !== 'object') {
          continue;
        }

        if (item.brand.toUpperCase() === category.brand.toUpperCase()) {
          categoryStats.processed++;
          totalStats.processed++;

          let defaultProfits = {
            profit: 4,
            profitReseller: 3,
            profitPlatinum: 2,
            profitGold: 2,
          };

          if (item.category === 'Voucher' || item.category === 'PLN') {
            defaultProfits = {
              profit: 4,
              profitReseller: 4,
              profitPlatinum: 2,
              profitGold: 3,
            };
          }

          try {
            // Gunakan transaksi untuk operasi database
            await prisma.$transaction(async (tx) => {
              const existingService = await tx.product.findFirst({
                where: {
                  providerId: item.buyer_sku_code
                }
              });

              if (!existingService) {
                // Hitung harga dengan markup
                const regularPrice = Math.round(
                  item.price + (item.price * defaultProfits.profitGold) / 100
                );
                const resellerPrice = Math.round(
                  item.price + (item.price * defaultProfits.profitReseller) / 100
                );
            
                const platinumBasePrice = Math.round(
                  item.price + (item.price * defaultProfits.profitPlatinum) / 100
                );

                // Buat produk baru
                await tx.product.create({
                  data: {
                    name: item.product_name,
                    categoryId: category.id,
                    providerId: item.buyer_sku_code,
                    price: item.price,
                    resellerPrice: resellerPrice,
                    platinumPrice: platinumBasePrice,
                    regularPrice: regularPrice,
                    profit: defaultProfits.profit,
                    profitReseller: defaultProfits.profitReseller,
                    profitPlatinum: defaultProfits.profitPlatinum,
                    profitGold: defaultProfits.profitGold,
                    isGoldProfitPercentage: true,
                    isPlatinumProfitPercentage: true,
                    isProfitPercentage: true,
                    isResellerProfitPercentage: true,
                    note: item.desc || '',
                    status: item.seller_product_status,
                    provider: 'digiflazz',
                    productLogo: null,
                    subCategoryId: 1,
                    isFlashSale: false,
                  },
                });
                categoryStats.created++;
                totalStats.created++;
              } else {
                const price = await PriceCheck({
                  price: Number(item.price), 
                  productId: existingService.id
                });

                await tx.product.update({
                  where: {
                    id: existingService.id
                  },
                  data: {
                    name: item.product_name,
                    price: item.price,
                    resellerPrice: price.resellerPrice,
                    platinumPrice: price.platinumPrice,
                    regularPrice: price.regularPrice,
                    note: item.desc || '',
                    status: item.seller_product_status,
                  }
                });
                categoryStats.updated++;
                totalStats.updated++;
              }
            });

          } catch (error) {
            console.error(`Error processing product ${item.buyer_sku_code}:`, error);
          }
        }
      }

      console.log(`Category ${category.brand}: processed=${categoryStats.processed}, created=${categoryStats.created}, updated=${categoryStats.updated}`);
    }

    console.log(`Total stats: processed=${totalStats.processed}, created=${totalStats.created}, updated=${totalStats.updated}`);
    sendResponse(res, digiProducts, "Get Product Successfully", 200);
  } catch (error) {
    console.error("Error fetching products:", error);
    sendResponse(res, null, "Failed to get products", 500);
  }
}