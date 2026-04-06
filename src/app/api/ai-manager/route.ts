import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { managerQueryPrompt } from "../../../ai/manager-query";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 🔹 FETCH ORDERS
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    let sales: Record<string, number> = {};

    ordersSnapshot.forEach((doc) => {
      const data = doc.data();

      data.items?.forEach((item: any) => {
        const name = item.medicineName;
        const qty = item.quantity;

        if (!sales[name]) sales[name] = 0;
        sales[name] += qty;
      });
    });

    // 🔹 FETCH PRODUCTS
    const productsSnapshot = await getDocs(collection(db, "products"));
    let products: any[] = [];

    productsSnapshot.forEach((doc) => {
      products.push(doc.data());
    });

    // 🔥 CREATE FULL DATA CONTEXT (VERY IMPORTANT)
    const fullData = `
SALES:
${JSON.stringify(sales, null, 2)}

PRODUCTS:
${JSON.stringify(products, null, 2)}
`;

    // 🔥 CALL GEMINI
    const { output } = await managerQueryPrompt({
      prompt,
      data: fullData,
    });

    return NextResponse.json(output);

  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}