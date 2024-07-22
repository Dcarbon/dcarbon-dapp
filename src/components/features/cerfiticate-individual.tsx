import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import { NumericFormat } from 'react-number-format';

function CerfiticateIndividual() {
  const [name, setName] = useState<string>('');
  const [isNameInvalid] = useState<boolean>(false);
  const [projectType, setProjectType] = useState<string>('');
  const [isProjectTypeInvalid] = useState<boolean>(false);
  const [projectLocation, setProjectLocation] = useState<string>('');
  const [isProjectLocationInvalid] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');

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
            inputWrapper: 'rounded-[4px] bg-[#F6F6F6]',
            label: '!text-[#21272A]',
            helperWrapper: 'px-0',
          }}
          autoComplete="off"
          isInvalid={isNameInvalid}
          errorMessage="Please enter your name!"
          variant={isNameInvalid ? 'bordered' : 'flat'}
          value={name}
          onValueChange={setName}
          isDisabled={false}
          isRequired
        />
      </div>
      <div className="flex flex-col gap-2 w-full mt-4">
        <label className="text-sm" htmlFor="total">
          Amount
        </label>
        <div className="relative">
          <NumericFormat
            thousandSeparator
            allowNegative={false}
            decimalScale={0}
            id="amount"
            className="text-sm w-full bg-[#F6F6F6] focus:bg-[#f6f6f6] p-3 rounded h-[40px] outline-none hover:bg-default-200 transition-all placeholder:text-[#888] placeholder:text-sm placeholder:font-normal"
            placeholder="0"
          />
        </div>
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
            inputWrapper: 'rounded-[4px] bg-[#F6F6F6]',
            label: '!text-[#21272A]',
            helperWrapper: 'px-0',
          }}
          autoComplete="off"
          isInvalid={isProjectTypeInvalid}
          errorMessage="Please enter your project type!"
          variant={isProjectTypeInvalid ? 'bordered' : 'flat'}
          value={projectType}
          onValueChange={setProjectType}
          isDisabled={false}
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
            inputWrapper: 'rounded-[4px] bg-[#F6F6F6]',
            label: '!text-[#21272A]',
            helperWrapper: 'px-0',
          }}
          autoComplete="off"
          isInvalid={isProjectLocationInvalid}
          errorMessage="Please enter your project location!"
          variant={isProjectLocationInvalid ? 'bordered' : 'flat'}
          value={projectLocation}
          onValueChange={setProjectLocation}
          isDisabled={false}
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
            inputWrapper: 'rounded-[4px] bg-[#F6F6F6]',
            label: '!text-[#21272A]',
            helperWrapper: 'px-0',
          }}
          autoComplete="off"
          value={reason}
          onValueChange={setReason}
          isDisabled={false}
        />
      </div>
    </div>
  );
}

export default CerfiticateIndividual;
