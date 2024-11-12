// components/Barcode.js
import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import Image from 'next/image';

const Barcode = ({ name, phoneNumber, companyName, imageUrl }) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      // Combine user data into a single string for the barcode
      const barcodeData = `${name}-${phoneNumber}-${companyName}`;
      JsBarcode(barcodeRef.current, barcodeData, {
        format: 'CODE128',
        displayValue: false,
        width: 1,
        height: 50,
      });
    }
  }, [name, phoneNumber, companyName]);

  return (
    <div className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg shadow-md">
      {/* <Image
        src={imageUrl}
        alt="Profile Picture"
        width={80}
        height={80}
        className="rounded-full"
      /> */}
      <img src={imageUrl} alt="" />
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm">{phoneNumber}</p>
      <p className="text-sm text-gray-500">{companyName}</p>
      <canvas ref={barcodeRef} className="mt-4" />
    </div>
  );
};

export default Barcode;
