import React from 'react';
import { cn, Input } from '@nextui-org/react';
import { NumericFormat } from 'react-number-format';

type ProjectsType = {
  projectsFt:
    | {
        id: string;
        location_name: string;
        amount: number;
        type: {
          name: string;
        };
      }[]
    | any[];
  projectFt?: {
    amount: number;
    type: {
      name: string;
    };
  };
};
function CertificateIndividual({
  amount,
  name,
  setName,
  isNameInvalid,
  setIsNameInvalid,

  reason,
  setReason,
  loading,
  isCountryInvalid,
  setCountry,
  setIsCountryInvalid,
  country,
  projects,
}: {
  amount: number;
  name: string;
  setName: (value: string) => void;
  isNameInvalid: boolean;
  setIsNameInvalid: (value: boolean) => void;
  reason?: string;
  setReason?: (value: string) => void;
  loading?: boolean;
  country: string;
  setCountry: (value: string) => void;
  isCountryInvalid: boolean;
  setIsCountryInvalid: (value: boolean) => void;
  projects?: ProjectsType;
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
            className="text-sm w-full bg-[#E7E7E7] focus:bg-white p-3 rounded h-[40px] outline-none hover:bg-default-200 transition-all placeholder:text-[#888] placeholder:text-sm placeholder:font-normal"
            placeholder="0"
            value={amount || 0}
          />
        </div>
        {projects && projects.projectFt?.amount ? (
          <p className="text-xs text-[#697077]">
            *This is the tokens of{' '}
            {!projects.projectsFt.length ? 'unknown' : 'mix'} origin{' '}
          </p>
        ) : null}
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
      <span className="text-[#21272A] text-sm mt-5 mb-2 block">
        Project information
      </span>
      <div className="flex flex-col gap-y-2 max-h-[282px] h-full overflow-y-auto scroll-w-none">
        {projects && projects.projectsFt?.length > 0
          ? projects.projectsFt.map((item) => (
              <div
                key={item.id}
                className="flex flex-col border-1 border-[#d1d1d1] border-dashed p-3 rounded *:flex *:gap-4 *:text-sm *:justify-start *:text-left gap-y-4"
              >
                <span>
                  <span className="w-[35%] text-nowrap text-[#888888] font-light">
                    Project type:
                  </span>
                  <span className="w-[65%] text-text-primary">
                    {item.type.name}
                  </span>
                </span>
                <span className="">
                  <span className="w-[35%] text-nowrap text-[#888888] font-light">
                    Project Location:
                  </span>
                  <span className="w-[65%] text-text-primary overflow-hidden text-ellipsis whitespace-pre-wrap break-words">
                    {item.location_name}
                  </span>
                </span>
                <span className="">
                  <span className="w-[35%] text-nowrap text-[#888888] font-light">
                    Amount:
                  </span>
                  <span className="w-[65%] text-text-primary">
                    {item.amount}
                  </span>
                </span>
              </div>
            ))
          : null}

        {projects?.projectFt ? (
          <div
            key={'fcfs'}
            className="flex flex-col border-1 border-[#d1d1d1] border-dashed p-3 rounded *:flex *:gap-4 *:text-sm *:justify-start *:text-left gap-y-4"
          >
            <span>
              <span className="w-[35%] text-nowrap text-[#888888] font-light">
                Project type:
              </span>
              <span className="w-[65%] text-text-primary">
                {projects.projectFt.type.name}
              </span>
            </span>
            <span className="">
              <span className="w-[35%] text-nowrap text-[#888888] font-light">
                Amount:
              </span>
              <span className="w-[65%] text-text-primary">
                {projects.projectFt.amount}
              </span>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CertificateIndividual;
