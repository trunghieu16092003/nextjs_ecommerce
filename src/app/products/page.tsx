import productApiRequests from "@/apiRequests/product";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductDelete from "@/components/product/ProductDelete";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ProductListPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;
  const isAuthenticated = Boolean(sessionToken);

  const { payload } = await productApiRequests.getList();
  const productLists = payload.data;
  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      {isAuthenticated && <Link href="/products/add">Thêm sản phẩm</Link>}

      <div>
        {productLists.map((product) => (
          <div key={product.id} className="p-4 border mb-4">
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="font-semibold">Price: ${product.price}</p>
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
              />
            </Link>

            {isAuthenticated && (
              <div className="flex">
                <Link href={`/products/${product.id}/edit`}>Sửa</Link>
                <ProductDelete product={product} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
