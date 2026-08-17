"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getOrders() {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } })
  return { success: true, orders }
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

    const order = await prisma.order.create({
      data: {
        customPaymentId,
        customer:  data.customer,
        phone:     data.phone,
        email:     data.email   || null,
        address:   data.address || null,
        items:     data.items,
        subtotal:  data.amount,
        amount:    data.amount,
        status:    "Pending",
      },
    })

    // Reduce stock for each cart item
    if (data.cartItems && data.cartItems.length > 0) {
      for (const item of data.cartItems) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } })
        if (product) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: Math.max(0, product.stock - item.quantity) },
          })
        }
      }
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true, order }
  } catch (error) {
    console.error("Failed to create order:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  await prisma.order.update({ where: { id }, data: { status } })

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true }
}

export async function deleteOrder(id: string) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  await prisma.order.delete({ where: { id } })

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true }
}
