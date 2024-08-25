import React from 'react';
import { cn, Input } from '@nextui-org/react';
import { NumericFormat } from 'react-number-format';

function CertificateCorporate({
  amount,
  name,
  setName,
  isNameInvalid,
  setIsNameInvalid,
  projectType,
  setProjectType,
  isProjectTypeInvalid,
  setIsProjectTypeInvalid,
  projectLocation,
  setProjectLocation,
  isProjectLocationInvalid,
  setIsProjectLocationInvalid,
  reason,
  setReason,
  address,
  setAddress,
  isAddressInvalid,
  setIsAddressInvalid,
  country,
  setCountry,
  isCountryInvalid,
  setIsCountryInvalid,
  loading,
}: {
  amount: number;
  name: string;
  setName: (value: string) => void;
  isNameInvalid: boolean;
  setIsNameInvalid: (value: boolean) => void;
  projectType: string;
  setProjectType: (value: string) => void;
  isProjectTypeInvalid: boolean;
  setIsProjectTypeInvalid: (value: boolean) => void;
  projectLocation: string;
  setProjectLocation: (value: string) => void;
  isProjectLocationInvalid: boolean;
  setIsProjectLocationInvalid: (value: boolean) => void;
  reason?: string;
  setReason?: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  isAddressInvalid: boolean;
  setIsAddressInvalid: (value: boolean) => void;
  country: string;
  setCountry: (value: string) => void;
  isCountryInvalid: boolean;
  setIsCountryInvalid: (value: boolean) => void;
  loading?: boolean;
}) {
  return (
    <div>
      <div>
        <Input
          key="name"
          type="text"
          labelPlacement="outside"
          label="Name"
          placeholder="Your name"
          radius="none"
          classNames={{
            inputWrapper: cn(
              'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
              isNameInvalid
                ? 'group-data-[focus=true]:ring-0 border-small'
                : '',
            ),
            label: '!text-[#21272A]',
            helperWrapper: 'px-0',
          }}
          autoComplete="off"
          isInvalid={isNameInvalid}
          errorMessage="Please enter your name!"
          variant={isNameInvalid ? 'bordered' : 'flat'}
          value={name}
          onValueChange={(value) => {
            if (!value) {
              setIsNameInvalid(true);
            } else {
              setIsNameInvalid(false);
            }
            setName(value);
          }}
          isDisabled={loading}
          isRequired
        />
      </div>

      <div className="mt-12">
        <Input
          key="address"
          type="text"
          labelPlacement="outside"
          label="Address"
          placeholder="Address"
          radius="none"
          classNames={{
            inputWrapper: cn(
              'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
              isAddressInvalid
                ? 'group-data-[focus=true]:ring-0 border-small'
                : '',
            ),
            label: '!text-[#21272A]',
            helperWrapper: 'px-0',
          }}
          autoComplete="off"
          isInvalid={isAddressInvalid}
          errorMessage="Please enter your address!"
          variant={isAddressInvalid ? 'bordered' : 'flat'}
          value={address}
          onValueChange={(value) => {
            if (!value) {
              setIsAddressInvalid(true);
            } else {
              setIsAddressInvalid(false);
            }
            setAddress(value);
          }}
          isDisabled={loading}
          isRequired
        />
      </div>

      <div className="mt-12">
        <Input
          key="country"
          type="text"
          labelPlacement="outside"
          label="Country"
          placeholder="Country"
          radius="none"
          classNames={{
            inputWrapper: cn(
              'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
              isCountryInvalid
                ? 'group-data-[focus=true]:ring-0 border-small'
                : '',
            ),
            label: '!text-[#21272A]',
            helperWrapper: 'px-0',
          }}
          autoComplete="off"
          isInvalid={isCountryInvalid}
          errorMessage="Please enter your country!"
          variant={isCountryInvalid ? 'bordered' : 'flat'}
          value={country}
          onValueChange={(value) => {
            if (!value) {
              setIsCountryInvalid(true);
            } else {
              setIsCountryInvalid(false);
            }
            setCountry(value);
          }}
          isDisabled={loading}
          isRequired
        />
      </div>

      <div className="flex flex-col gap-2 w-full mt-4">
        <label className="text-sm" htmlFor="total">
          Amount
        </label>
        <div className="relative">
          <NumericFormat
            disabled
            thousandSeparator
            allowNegative={false}
            decimalScale={1}
            id="amount"
            className="text-sm w-full bg-[#E7E7E7] focus:bg-[#f6f6f6] p-3 rounded h-[40px] outline-none hover:bg-default-200 transition-all placeholder:text-[#888] placeholder:text-sm placeholder:font-normal"
            placeholder="0"
            value={amount || 0}
          />
        </div>
      </div>

      <div className="mt-12">
        <Input
          key="reason"
          type="text"
          labelPlacement="outside"
          label="Reason"
          placeholder="Optional"
          radius="none"
          classNames={{
            inputWrapper: cn(
              'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
            ),
            label: '!text-[#21272A]',
            helperWrapper: 'px-0',
          }}
          autoComplete="off"
          value={reason}
          onValueChange={setReason}
          isDisabled={loading}
        />
      </div>

      <div className="mt-12">
        <Input
          key="project-type"
          type="text"
          labelPlacement="outside"
          label="Project type"
          placeholder="Project type"
          radius="none"
          classNames={{
            inputWrapper: cn(
              'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
              isProjectTypeInvalid
                ? 'group-data-[focus=true]:ring-0 border-small'
                : '',
            ),
            label: '!text-[#21272A]',
            helperWrapper: 'px-0',
          }}
          autoComplete="off"
          isInvalid={isProjectTypeInvalid}
          errorMessage="Please enter your project type!"
          variant={isProjectTypeInvalid ? 'bordered' : 'flat'}
          value={projectType}
          onValueChange={(value) => {
            if (!value) {
              setIsProjectTypeInvalid(true);
            } else {
              setIsProjectTypeInvalid(false);
            }
            setProjectType(value);
          }}
          isDisabled={loading}
          isRequired
        />
      </div>

      <div className="mt-12">
        <Input
          key="project-location"
          type="text"
          labelPlacement="outside"
          label="Project location"
          placeholder="Project location"
          radius="none"
          classNames={{
            inputWrapper: cn(
              'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
              isProjectLocationInvalid
                ? 'group-data-[focus=true]:ring-0 border-small'
                : '',
            ),
            label: '!text-[#21272A]',
            helperWrapper: 'px-0',
          }}
          autoComplete="off"
          isInvalid={isProjectLocationInvalid}
          errorMessage="Please enter your project location!"
          variant={isProjectLocationInvalid ? 'bordered' : 'flat'}
          value={projectLocation}
          onValueChange={(value) => {
            if (!value) {
              setIsProjectLocationInvalid(true);
            } else {
              setIsProjectLocationInvalid(false);
            }
            setProjectLocation(value);
          }}
          isDisabled={loading}
          isRequired
        />
      </div>
    </div>
  );
}

export default CertificateCorporate;
