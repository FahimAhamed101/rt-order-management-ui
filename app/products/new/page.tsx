// app/products/new/page.tsx
"use client";

import ProductForm from "@/app/components/Products/ProductForm";

export default function AddProduct() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">
          Create a new product to add to your inventory
        </p>
      </div>
      <ProductForm />
    </div>
  );
}