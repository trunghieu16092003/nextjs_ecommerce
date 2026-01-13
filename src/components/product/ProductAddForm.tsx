"use client";
import React, { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import {
  CreateProductBody,
  CreateProductBodyType,
  ProductResType,
  UpdateProductBodyType,
} from "@/schemaValidations/product.schema";
import productApiRequests from "@/apiRequests/product";

type Product = ProductResType["data"];

const ProductAddForm = ({ product }: { product?: Product }) => {
  const [file, setFile] = React.useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      image: product?.image || "",
    },
  });

  const image = form.watch("image");

  const handleCreate = async (values: CreateProductBodyType) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      const uploadImageResult = await productApiRequests.uploadImage(formData);
      const imageUrl = uploadImageResult.payload.data;
      await productApiRequests.create({ ...values, image: imageUrl });

      router.push("/products");
      router.refresh();
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (_values: UpdateProductBodyType) => {
    if (!product) return;
    setLoading(true);
    let values = _values;
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file as Blob);
        const uploadImageResult = await productApiRequests.uploadImage(
          formData
        );
        const imageUrl = uploadImageResult.payload.data;
        values = { ...values, image: imageUrl };
      }

      await productApiRequests.update(product?.id, values);

      router.push("/products");
      router.refresh();
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(values: CreateProductBodyType) {
    if (loading) return;
    if (product) {
      await handleUpdate(values);
    } else {
      await handleCreate(values);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 max-w-[600px] w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sản phẩm</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả" {...field}></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                      field.onChange("http://localhost:3000/" + file.name);
                    }
                  }}
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(file || image) && (
          <div>
            <Image
              src={file ? URL.createObjectURL(file) : image}
              alt="Preview"
              width={128}
              height={128}
              alt="Preview"
              className="w-32 h-32 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setFile(null);
                form.setValue("image", "");
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
              className="!mt-8 w-full"
            >
              Xóa ảnh
            </Button>
          </div>
        )}
        <Button type="submit" className="!mt-8  w-full">
          {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </Button>
      </form>
    </Form>
  );
};

export default ProductAddForm;
