"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getOrders() {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, orders: (data ?? []).map(mapOrder) }
}

export async function createOrder(data: {
  customer:   string
  phone:      string
  email?:     string
  address?:   string
  items:      string
  amount:     number
  cartItems?: { productId: string; quantity: number }[]
}) {
  try {
    const customPaymentId = `MB-MANUAL-${Date.now()}`

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        custom_payment_id: customPaymentId,
        customer_name:     data.customer,
        customer_phone:    data.phone,
        customer_email:    data.email   || null,
        delivery_address:  data.address || null,
        items:             data.items,
        subtotal:          data.amount,
        total_amount:      data.amount,
        status:            "Pending",
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Reduce stock for each cart item
    if (data.cartItems && data.cartItems.length > 0) {
      for (const item of data.cartItems) {
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.productId)
          .single()

        if (product) {
          await supabase
            .from("products")
            .update({ stock: Math.max(0, product.stock - item.quantity) })
            .eq("id", item.productId)
        }
      }
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true, order: mapOrder(order) }
  } catch (error) {
    console.error("Failed to create order:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true }
}

export async function deleteOrder(id: string) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("orders").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true }
}

// ─── Row → TypeScript shape ───────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrder(row: any) {
  return {
    id:              row.id as string,
    customer:        (row.customer_name ?? row.customer) as string,
    email:           row.customer_email as string | undefined,
    phone:           row.customer_phone as string,
    address:         row.delivery_address as string | undefined,
    items:           typeof row.items === "string" ? row.items : JSON.stringify(row.items),
    amount:          Number(row.total_amount ?? row.amount),
    status:          row.status as string,
    date:            row.created_at ? new Date(row.created_at) : new Date(),
    customPaymentId: row.custom_payment_id as string | undefined,
    isTest:          Boolean(row.is_test),
  }
}
