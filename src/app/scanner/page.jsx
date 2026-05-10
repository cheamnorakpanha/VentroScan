"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 500,
        height: 500,
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      window.location.href = `https://www.barcodelookup.com/${result}`;
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {scanResult ? (
        <div>
          Success: <a href={"http://" + scanResult}>{scanResult}</a>
        </div>
      ) : (
        <div id="reader" className="w-[800px] h-[800px]"></div>
      )}
    </div>
  );
}
