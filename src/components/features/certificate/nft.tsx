'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IGetCertificateDetailResponse } from '@/adapters/user';
import { cn } from '@nextui-org/react';
import Big from 'big.js';
import { env } from 'env.mjs';
import certBg from 'public/images/certificates/cert-bg.jpg';
import certificateTemplate from 'public/images/certificates/certificate-template.svg';
import decorBottomLeft from 'public/images/certificates/decor-bottom-left.svg';
import decorBottomRight from 'public/images/certificates/decor-bottom-right.svg';
import QRCode from 'qrcode';

function NftCertificate({
  data,
  className,
}: {
  data?: IGetCertificateDetailResponse;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasHeight, setCanvasHeight] = useState(842);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const perTransactionPerPage = 2.5;
    const initCanvas = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      await loadFont('LexendDeca400', '/fonts/lexend-deca-400.ttf');
      await loadFont('LexendDeca500', '/fonts/lexend-deca-500.ttf');
      await loadFont('Lexend400', '/fonts/lexend-400.ttf');
      const ctx = canvas.getContext('2d');

      async function loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = (err) => reject(err);
        });
      }

      function loadFont(name: string, src: string) {
        return new Promise((resolve, reject) => {
          const font = new FontFace(name, `url(${src})`);

          font
            .load()
            .then((loadedFont) => {
              document.fonts.add(loadedFont);
              resolve({ name, src });
            })
            .catch((error) => {
              reject(error);
            });
        });
      }

      function drawText(
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number,
      ) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, currentY);
            line = words[i] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }

        ctx.fillText(line, x, currentY);

        return currentY;
      }

      function drawWrappedText(
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number,
      ) {
        let line = '';
        let currentY = y;

        for (let i = 0; i < text.length; i++) {
          line += text[i];
          const metrics = ctx.measureText(line);
          if (metrics.width > maxWidth) {
            ctx.fillText(line.slice(0, -1), x, currentY);
            line = text[i];
            currentY += lineHeight;
          }
        }

        ctx.fillText(line, x, currentY);
        return currentY;
      }

      function drawWrappedText2(
        ctx: CanvasRenderingContext2D,
        text: string,
        color: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number,
        font?: string,
      ) {
        const words = text.split(' ');
        let line = '';
        ctx.fillStyle = color;
        if (font) {
          ctx.font = font;
        }

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const testWidth = ctx.measureText(testLine).width;

          if (testWidth > maxWidth && line !== '') {
            ctx.fillText(line, x, y);
            line = words[i] + ' ';
            y += lineHeight;
            x = 64; // Reset vị trí x về đầu dòng
          } else {
            line = testLine;
          }
        }

        ctx.fillText(line, x, y);

        return y;
      }

      function drawDynamicText(
        ctx: CanvasRenderingContext2D,
        part1: string,
        dynamicData: string,
        part2: string,
        startX: number,
        startY: number,
        maxWidth: number,
        lineHeight: number,
      ) {
        let lastX = startX;
        let lastY = startY;

        lastY = drawWrappedText2(
          ctx,
          part1,
          '#888',
          lastX,
          lastY,
          maxWidth,
          lineHeight,
        );

        lastX = ctx.measureText(part1).width + startX;
        lastY = drawWrappedText2(
          ctx,
          dynamicData,
          '#000',
          lastX,
          lastY,
          maxWidth,
          lineHeight,
          '16px LexendDeca500',
        );

        lastX = ctx.measureText(dynamicData).width + lastX;

        return drawWrappedText2(
          ctx,
          part2,
          '#888',
          lastX,
          lastY,
          maxWidth,
          lineHeight,
          '16px LexendDeca400',
        );
      }

      if (!ctx) return;

      const bg = await loadImage(certBg.src);
      const template = await loadImage(certificateTemplate.src);

      ctx.drawImage(bg, 0, 0, 595, 842);
      ctx.drawImage(template, 0, 0, 595, 842);

      if (data?.data?.burn_tx && data?.data?.burn_tx?.length > 0) {
        const page = Math.ceil(
          data?.data?.burn_tx?.length / perTransactionPerPage,
        );

        let y = 842;
        for (let i = 0; i < page; i++) {
          ctx.drawImage(bg, 0, y, 595, 842);
          y += 842;
        }
      }

      ctx.save();

      // ctx.font = '12px LexendDeca400';
      // ctx.fillStyle = '#979E91';
      // ctx.textAlign = 'right';
      // drawText(ctx, project_location, 532, 113, 279, 15);

      ctx.restore();

      ctx.font = '16px LexendDeca500';
      ctx.fillStyle = '#979E91';
      const transactionText = 'The Transaction at';
      const dateText = 'Date';
      const transactionTextWidth = ctx.measureText(transactionText).width;

      let yDate = 591;
      let yTx = 521;
      data?.data?.burn_tx?.forEach((transaction) => {
        ctx.fillStyle = '#979E91';
        ctx.fillText(transactionText, 64, yTx, 136);
        ctx.fillStyle = '#000';
        const yTxValue = drawWrappedText(
          ctx,
          transaction,
          83 + transactionTextWidth,
          yTx,
          300,
          20,
        );
        ctx.fillText(
          data?.data?.burned_at || '',
          83 + transactionTextWidth,
          yTxValue + 30,
          136,
        );

        ctx.fillStyle = '#979E91';
        ctx.fillText(dateText, 64, yTxValue + 30, 136);

        yDate = yTxValue + 30;

        yTx = yDate + 50;
        yDate = yTx + 70;
      });

      ctx.restore();

      ctx.font = '16px LexendDeca400';
      ctx.fillStyle = '#888';
      ctx.fillText('is the proof that', 64, yDate - 20, 140);
      ctx.fillStyle = '#1C2916';
      ctx.font = '56px Lexend400';
      const yOwner = drawText(
        ctx,
        data?.data?.name || '',
        64,
        yDate + 50,
        340,
        70,
      );

      ctx.restore();
      ctx.font = '16px LexendDeca400';
      const yCarbon = drawDynamicText(
        ctx,
        'Has retired',
        ` ${Number(Big(data?.data?.amount || 0).toFixed(1)).toLocaleString('en-US')} CARBON `,
        'token from the',
        64,
        yOwner + 50,
        220,
        20,
      );
      ctx.font = '16px LexendDeca400';
      const yProjectName = drawText(
        ctx,
        `${data?.data?.project_name || 'multiple projects'}`,
        64,
        yCarbon + 20,
        220,
        20,
      );

      if (data?.data?.burn_tx && data?.data?.burn_tx?.length === 1) {
        const qrUri = await QRCode.toDataURL(
          `https://explorer.solana.com/tx/${data.data.burn_tx[0]}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`,
          {
            width: 95,
            errorCorrectionLevel: 'low',
          },
        );

        const qrImage = await loadImage(qrUri);
        ctx.drawImage(qrImage, 438, yProjectName - 90, 95, 95);
      }

      const decorBottomLeftImage = await loadImage(decorBottomLeft.src);
      const decorBottomRightImage = await loadImage(decorBottomRight.src);
      ctx.drawImage(decorBottomLeftImage, 22, yProjectName - 2, 45.57, 48);
      ctx.drawImage(
        decorBottomRightImage,
        canvas.width - (22 + 46),
        yProjectName - 2,
        48,
        45.57,
      );

      setCanvasHeight(yProjectName + 74);
      setMounted(true);
    };

    initCanvas();
  }, [
    canvasHeight,
    data?.data?.amount,
    data?.data?.burn_tx,
    data?.data?.burned_at,
    data?.data?.name,
    data?.data?.project_name,
  ]);

  return (
    <div className="z-10 mx-auto my-12">
      <canvas
        ref={canvasRef}
        width={595}
        height={canvasHeight}
        className={cn(
          'w-full h-auto ring-[#cfcfcf]',
          mounted ? 'ring-2' : '',
          className ? className : '',
        )}
        style={{
          aspectRatio: `595/${canvasHeight}`,
        }}
      />
    </div>
  );
}

export default NftCertificate;
