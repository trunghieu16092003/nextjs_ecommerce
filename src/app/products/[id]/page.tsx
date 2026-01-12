import productApiRequests from "@/apiRequests/product";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  let product = null;
  try {
    const { payload } = await productApiRequests.getDetail(Number(params.id));
    product = payload.data;
  } catch (error) {}
  return (
    <div key={product?.id} className="p-4 border mb-4">
      <h2 className="text-lg font-bold">{product?.name}</h2>
      <p>{product?.description}</p>
      <p className="font-semibold">Price: ${product?.price}</p>

      <Image
        src={product?.image}
        alt={product?.name}
        width={200}
        height={200}
      />
    </div>
  );
}
