'use client';

import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';

import 'svg2pdf.js';

import { str } from './bg';

function Pdf() {
  const [doc, setDoc] = useState(null);
  useEffect(() => {
    const doc = new jsPDF();
    doc
      .svg(str, {
        x: 0,
        y: 0,
        width: 595,
        height: 842,
      })
      .then(() => {
        // save the created pdf
        doc.save('myPDF.pdf');
      });
  }, []);
  return (
    <div className="mt-[100px] h-screen">
      <iframe
        id="pdf-file"
        src=""
        className="w-full h-full"
        title="pdf-file"
      ></iframe>
    </div>
  );
}

export default Pdf;
