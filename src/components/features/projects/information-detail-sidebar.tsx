'use client';

import React, { useState } from 'react';
import DCarbonButton from '@/components/common/button';
import { NumericFormat } from 'react-number-format';

function InformationDetailSidebar({ data }: { data: any }) {
  const [quantity, setQuantity] = useState<string>('');
  const carbonCreditInfo = data?.data?.carbon_credit_info;

  return (
    <>
      <div className="bg-[#F6F6F6] p-4 rounded-lg text-[#21272A]">
        <h3 className="text-[23px] font-medium mb-6">Information</h3>

        <div className="bg-[#FFFFFF] p-4 rounded">
          <div className="text-sm font-light mb-2">
            1 carbon credit ={' '}
            {carbonCreditInfo?.exchange_rate &&
            carbonCreditInfo?.exchange_rate_currency
              ? `${carbonCreditInfo?.exchange_rate} ${carbonCreditInfo?.exchange_rate_currency}`
              : ''}
          </div>
          <div className="text-sm font-light flex flex-wrap gap-3 items-baseline">
            <span>Available DCarbon:</span>
            <span className="font-medium text-lg text-primary-color">
              {carbonCreditInfo?.carbon_total || 0} DC
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="quantity">
              Quantity
            </label>
            <div className="relative">
              <NumericFormat
                value={quantity}
                thousandSeparator
                allowNegative={false}
                onValueChange={(q) => {
                  setQuantity(q.value);
                }}
                id="quantity"
                className="text-sm w-full bg-white p-3 pr-[82.63px] rounded h-[40px] outline-none hover:bg-gray-50 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal"
                placeholder="0.1"
              />

              <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
                CARBON
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="asset">
              Asset
            </label>
            <div className="relative">
              <NumericFormat
                thousandSeparator
                allowNegative={false}
                id="asset"
                className="text-sm w-full bg-white p-3 pr-[52.63px] rounded h-[40px] outline-none hover:bg-gray-50 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal"
                placeholder="0"
              />

              <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
                ETH
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="total">
              Total
            </label>
            <div className="relative">
              <NumericFormat
                thousandSeparator
                allowNegative={false}
                id="total"
                className="text-sm w-full bg-white p-3 pr-[52.63px] rounded h-[40px] outline-none hover:bg-gray-50 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal"
                placeholder="0"
              />

              <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
                ETH
              </div>
            </div>
          </div>

          <DCarbonButton color="primary">Buy</DCarbonButton>
        </div>
      </div>

      <div className="bg-[#F6F6F6] p-4 rounded-lg text-[#21272A] mt-6">
        <h3 className="text-[23px] font-medium mb-6">Address</h3>
        <div className="text-sm mb-2">Location</div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5083.089990768232!2d105.78816679098541!3d10.044482718530391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a063a1771a0823%3A0xa7fe937e43c2970c!2zS2jDoWNoIHPhuqFuIE3GsOG7nW5nIFRoYW5oIEx1eHVyeSBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1721130792950!5m2!1svi!2s"
          width="100%"
          height="200"
          className="border-none rounded"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </>
  );
}

export default InformationDetailSidebar;
