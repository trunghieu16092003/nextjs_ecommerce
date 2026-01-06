import productApiRequests from "@/apiRequests/product";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductDelete from "@/components/product/ProductDelete";

export const dynamic = "force-dynamic";

export default async function ProductListPage() {
  const { payload } = await productApiRequests.getList();
  const productLists = payload.data;
  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <Link href="/products/add">Thêm sản phẩm</Link>
      <div>
        {productLists.map((product) => (
          <div key={product.id} className="p-4 border mb-4">
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="font-semibold">Price: ${product.price}</p>
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
              />
            )}
            <Link href={`/products/${product.id}`}>Sửa</Link>
            <ProductDelete product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
