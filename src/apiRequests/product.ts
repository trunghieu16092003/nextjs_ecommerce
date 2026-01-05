import http from "@/lib/http";
import { CreateProductBodyType } from "@/schemaValidations/product.schema";

const productApiRequests = {
    get: () => http.get("/products"),
    uploadImage: (body: FormData) => http.post<{message: string, data: string}>("/media/upload", body),
    create: (body: CreateProductBodyType) => http.post("/products", body),
    update: (id: number, body: any) => http.put(`/products/${id}`, body),
    delete: (id: number) => http.delete(`/products/${id}`),
};

export default productApiRequests;