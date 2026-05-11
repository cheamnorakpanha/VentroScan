"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function Scanner() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 600,
          height: 600,
        },
        fps: 5,
      },
      false,
    );

    scanner.render(success, error);

    async function success(result) {
      scanner.clear();

      setLoading(true);

      try {
        const response = await fetch(`/api/product?barcode=${result}`);

        const data = await response.json();

        if (data.products && data.products.length > 0) {
          setProduct(data.products[0]);
        } else {
          alert("No product found");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black p-4">
      {loading ? (
        <div className="text-xl">Loading product...</div>
      ) : product ? (
        <div className="max-w-4xl border rounded-xl shadow-lg p-6">
          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-100 object-contain mb-4"
            />
          )}

          <h1 className="text-xl font-bold mb-2">
            Title: <span className="font-normal">{product.title}</span>
          </h1>

          <h1 className="text-xl font-bold mb-2">
            Brand: <span className="font-normal">{product.brand}</span>
          </h1>

          <h1 className="text-xl font-bold mb-2">
            Category: <span className="font-normal">{product.category}</span>
          </h1>

          <h1 className="text-xl font-bold mb-2 text-justify">
            Description:{" "}
            <span className="font-normal">{product.description}</span>
          </h1>

          <h1 className="text-xl font-bold mb-2">
            Manufacturer:{" "}
            <span className="font-normal">{product.manufacturer}</span>
          </h1>

          <h1 className="text-xl font-bold mb-2">
            Barcode Number:{" "}
            <span className="font-normal">{product.barcode_number}</span>
          </h1>

          <h1 className="text-xl font-bold mb-2">
            Last Updated:{" "}
            <span className="font-normal">{product.last_update}</span>
          </h1>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-black text-white px-4 py-2 rounded"
          >
            Scan Again
          </button>
        </div>
      ) : (
        <div id="reader" className="w-[700px]" />
      )}
    </div>
  );
}
