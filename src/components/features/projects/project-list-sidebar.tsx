import React, { ReactNode, useMemo, useState } from 'react';
import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import DCarbonButton from '@/components/common/button';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Image,
  Input,
  Spinner,
} from '@nextui-org/react';
import countryList from 'country-list';
import arrowDownIcon from 'public/images/common/arrow-down-icon.svg';
import checkboxCheckedIcon from 'public/images/common/checkbox-checked.svg';
import filterIcon from 'public/images/common/filter-icon.svg';
import locationIcon from 'public/images/common/location-icon.svg';
import searchIcon from 'public/images/common/search-icon.svg';
import ReactCountryFlag from 'react-country-flag';
import Select from 'react-select';
import { useProjectStore } from '@/app/project-store-provider';

const DropdownIndicator = () => (
  <div className="h-6 w-8 translate-y-[2px] flex justify-end">
    <Image
      src={searchIcon.src}
      as={NextImage}
      alt="search"
      width={20}
      height={20}
      radius="none"
      draggable={false}
    />
  </div>
);

const Menu = (props: JSX.IntrinsicElements['div']) => {
  const shadow = 'hsla(218, 50%, 10%, 0.1)';
  return (
    <div
      className="bg-white rounded-[4px] mt-2 absolute w-full z-[30] p-4"
      style={{
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
      }}
      {...props}
    />
  );
};

const Blanket = (props: JSX.IntrinsicElements['div']) => (
  <div
    className="bottom-0 left-0 top-0 right-0 fixed z-1 w-screen h-screen"
    {...props}
  />
);

const Dropdown = ({
  children,
  isOpen,
  target,
  onClose,
}: {
  children?: ReactNode;
  readonly isOpen: boolean;
  readonly target: ReactNode;
  readonly onClose: () => void;
}) => (
  <div style={{ position: 'relative' }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);

function ProjectListSidebar() {
  const keyword = useProjectStore((state) => state.keyword);
  const setKeyword = useProjectStore((state) => state.setKeyword);
  const setFilters = useProjectStore((state) => state.setFilters);
  const setAction = useProjectStore((state) => state.setAction);
  const action = useProjectStore((state) => state.action);
  const isLoading = useProjectStore((state) => state.isLoading);
  const searchParams = useSearchParams();
  const model = searchParams.get('model');

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [countryValue, setCountryValue] = useState<{
    label: string;
    value: string;
  }>();
  const [location, setLocation] = useState<string>('');
  const [interm, setInterm] = React.useState(['']);

  const countryData = countryList.getData();

  const countrySelectOptions = useMemo(
    () =>
      countryData.map((ct) => ({
        label: ct.name,
        value: ct.code,
      })),
    [countryData],
  );

  const selectStyles = {
    control: (provided: any) => {
      return {
        ...provided,
        minWidth: 240,
        marginBottom: 16,
        border: 0,
        background: '#F6F6F6',
        boxShadow: 'none',
        flexDirection: 'row-reverse',
      };
    },
    menu: () => ({ boxShadow: 'inset 0 0px 0 rgba(0, 0, 0, 0.1)' }),
    option: (provided: any, { isDisabled, isFocused, isSelected }: any) => ({
      ...provided,
      // eslint-disable-next-line quote-props
      cursor: 'pointer',

      // eslint-disable-next-line quote-props
      backgroundColor: isDisabled
        ? undefined
        : isSelected
          ? '#EAFFC7'
          : isFocused
            ? '#EAFFC7'
            : undefined,
      // eslint-disable-next-line quote-props
      color: isDisabled
        ? undefined
        : isSelected
          ? '#21272A'
          : isFocused
            ? '#21272A'
            : undefined,
      ':active': {
        ...provided[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? '#EAFFC7'
            : '#EAFFC7'
          : undefined,
      },
    }),
  };

  return (
    <div>
      <div className="mb-6">Tìm kiếm dự án</div>
      <Input
        key="search"
        type="text"
        labelPlacement="outside"
        label={null}
        placeholder="Search..."
        radius="none"
        classNames={{
          inputWrapper: 'rounded-[4px] max-w-[408px]',
          label: '!text-[#21272A]',
          innerWrapper: ['custom-input'],
        }}
        autoComplete="off"
        endContent={
          action === 'search' && isLoading ? (
            <Spinner size="sm" color="success" labelColor="success" />
          ) : (
            <Image
              src={searchIcon.src}
              as={NextImage}
              alt="search"
              width={20}
              height={20}
              radius="none"
              draggable={false}
            />
          )
        }
        value={keyword}
        onValueChange={(kw) => {
          setKeyword(kw);
          setAction('search');
        }}
      />
      <div className="flex gap-2 items-center my-8">
        <Image
          src={filterIcon.src}
          as={NextImage}
          width={20}
          height={20}
          alt="Filter"
          radius="none"
          draggable={false}
        />
        <div>Filter</div>
      </div>

      <div className="text-[#21272A] text-sm mb-2">Country</div>

      <div className="mb-12">
        <Dropdown
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          target={
            <Button
              disableRipple
              radius="none"
              className="rounded-[4px] bg-default-100 hover:bg-default-200 data-[pressed=true]:scale-[1] text-[#697077] justify-between"
              fullWidth
              endContent={
                <Image
                  src={arrowDownIcon.src}
                  as={NextImage}
                  alt="arrow"
                  width={20}
                  height={20}
                  draggable={false}
                  radius="none"
                />
              }
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-[10px]">
                {countryValue ? (
                  <ReactCountryFlag
                    countryCode={countryValue.value}
                    svg
                    className="!w-[33.6px] !h-[24px]"
                  />
                ) : null}
                <div className="max-w-[280px] overflow-hidden text-ellipsis">
                  {countryValue?.label || 'Country'}
                </div>
              </div>
            </Button>
          }
        >
          <Select
            noOptionsMessage={() => 'No country'}
            autoFocus
            backspaceRemovesValue={false}
            components={{ DropdownIndicator, IndicatorSeparator: null }}
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            isClearable={false}
            menuIsOpen
            onChange={(newValue: any) => {
              setCountryValue(newValue);
              setIsOpen(false);
            }}
            options={countrySelectOptions}
            placeholder="Search country"
            styles={selectStyles}
            tabSelectsValue={false}
            value={countryValue}
            formatOptionLabel={(option: any) => {
              return (
                <div className="flex gap-[10px] items-center">
                  <ReactCountryFlag
                    countryCode={option.value}
                    svg
                    className="!w-[33.6px] !h-[24px]"
                  />
                  <div>{option.label}</div>
                </div>
              );
            }}
          />
        </Dropdown>
      </div>

      <div className="mb-6">
        <Input
          key="location"
          type="text"
          labelPlacement="outside"
          label="Location"
          placeholder="Type location"
          radius="none"
          classNames={{
            inputWrapper: 'rounded-[4px] max-w-[408px]',
            label: '!text-[#21272A]',
            innerWrapper: ['custom-input'],
          }}
          autoComplete="off"
          endContent={
            <Image
              src={locationIcon.src}
              as={NextImage}
              alt="Location"
              width={20}
              height={20}
              radius="none"
              draggable={false}
            />
          }
          value={location}
          onValueChange={setLocation}
        />
      </div>

      <div className="mb-6">
        {['G', 'E'].includes(model || '') && (
          <CheckboxGroup
            label={model === 'G' ? 'Scale' : 'Power'}
            color="default"
            value={interm}
            onValueChange={(value) => {
              const newValue = value?.[value.length - 1];
              setInterm(newValue ? [newValue] : []);
            }}
            classNames={{
              label: 'text-sm text-[#21272A]',
            }}
            radius="full"
          >
            <Checkbox
              value="small"
              classNames={{
                label: 'text-[#4F4F4F] text-sm',
                wrapper: 'before:border-[1px]',
              }}
              icon={({ size, height, width, ...props }: any) => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  isSelected,
                  // eslint-disable-next-line no-unused-vars
                  isIndeterminate,
                  // eslint-disable-next-line no-unused-vars
                  disableAnimation,
                  ...otherProps
                } = props;

                return (
                  <div {...otherProps} style={{ width: 20, height: 20 }}>
                    <Image
                      src={checkboxCheckedIcon.src}
                      alt="checkbox"
                      as={NextImage}
                      width={20}
                      height={20}
                      radius="none"
                      draggable={false}
                    />
                  </div>
                );
              }}
            >
              Small: ({model === 'G' ? '40 - 90 KvA' : '1 - 20 Ton'})
            </Checkbox>
            <Checkbox
              value="medium"
              classNames={{
                label: 'text-[#4F4F4F] text-sm',
                wrapper: 'before:border-[1px]',
              }}
              icon={({ size, height, width, ...props }: any) => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  isSelected,
                  // eslint-disable-next-line no-unused-vars
                  isIndeterminate,
                  // eslint-disable-next-line no-unused-vars
                  disableAnimation,
                  ...otherProps
                } = props;

                return (
                  <div {...otherProps} style={{ width: 20, height: 20 }}>
                    <Image
                      src={checkboxCheckedIcon.src}
                      alt="checkbox"
                      as={NextImage}
                      width={20}
                      height={20}
                      radius="none"
                      draggable={false}
                    />
                  </div>
                );
              }}
            >
              Medium ({model === 'G' ? '90 - 200 KvA' : '20 - 100 Ton'})
            </Checkbox>
            <Checkbox
              value="large"
              classNames={{
                label: 'text-[#4F4F4F] text-sm',
                wrapper: 'before:border-[1px]',
              }}
              icon={({ size, height, width, ...props }: any) => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  isSelected,
                  // eslint-disable-next-line no-unused-vars
                  isIndeterminate,
                  // eslint-disable-next-line no-unused-vars
                  disableAnimation,
                  ...otherProps
                } = props;

                return (
                  <div {...otherProps} style={{ width: 20, height: 20 }}>
                    <Image
                      src={checkboxCheckedIcon.src}
                      alt="checkbox"
                      as={NextImage}
                      width={20}
                      height={20}
                      radius="none"
                      draggable={false}
                    />
                  </div>
                );
              }}
            >
              Large ({model === 'G' ? '>200 KvA' : '>100 Ton'})
            </Checkbox>
          </CheckboxGroup>
        )}
      </div>

      <div className="flex gap-6">
        <DCarbonButton
          fullWidth
          className="bg-[#F6F6F6]"
          onClick={() => {
            setCountryValue(undefined);
            setLocation('');
            setInterm(['']);
          }}
          disabled={isLoading}
        >
          Clear
        </DCarbonButton>
        <DCarbonButton
          color="primary"
          fullWidth
          onClick={() => {
            setAction('filter');
            setFilters({
              country: countryValue,
              location,
              quantity:
                interm?.[0] === 'small'
                  ? 'PrjU_Smal'
                  : interm?.[0] === 'medium'
                    ? 'PrjU_Medium'
                    : interm?.[0] === 'large'
                      ? 'PrjU_Large'
                      : 'PrjU_None',
            });
          }}
          isLoading={isLoading && action === 'filter'}
        >
          Confirm
        </DCarbonButton>
      </div>
    </div>
  );
}

export default ProjectListSidebar;
