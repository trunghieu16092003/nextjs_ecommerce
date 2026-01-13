import React from "react";
import productApiRequests from "@/apiRequests/product";
import ProductAddForm from "@/components/product/ProductAddForm";

export default async function ProductEdit({
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
    <div>
      {product && (
        <div>
          <h1>Sửa sản phẩm</h1>
          <ProductAddForm product={product} />
        </div>
      )}
      {!product && <p>Không tìm thấy sản phẩm.</p>}
    </div>
  );
}
