/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import CustomText from "./CustomText";
import { useFormikContext } from "formik";
import { Eye, EyeSlash } from "iconsax-reactjs";
import { Flex, Input, InputGroup } from "@chakra-ui/react";

interface IProps {
  name: string;
  label: string;
  isPassword?: boolean;
  type?: "text" | "number" | "email" | "password";
  placeholder?: string;
  disabled?: boolean;
}

function CustomInput({
  name,
  label,
  isPassword = false,
  type = "text",
  placeholder = "",
  disabled = false,
}: IProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const { handleBlur, handleChange, errors, touched, values } =
    useFormikContext<any>();

  const hasError = Boolean(errors[name] && touched[name]);

  return (
    <Flex w="full" flexDir="column" gap="1.5">
      <CustomText
        type="REGULAR"
        fontSize="13"
        text={label}
        color={hasError ? "red.500" : "gray.700"}
      />
      <div className="relative w-full">
        <InputGroup
          endElement={
            isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                style={{ zIndex: 10 }}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlash size="18" color="#666" />
                ) : (
                  <Eye size="18" color="#666" />
                )}
              </button>
            )
          }
        >
          <Input
            type={
              isPassword
                ? showPassword
                  ? "text"
                  : "password"
                : type === "password"
                ? "password"
                : type
            }
            name={name}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            value={values[name] ?? ""}
            onChange={(e) => {
              if (type === "number") {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }
              handleChange(e);
            }}
            onBlur={handleBlur}
            width="full"
            height="46px"
            fontSize="14px"
            color="black"
            borderWidth="1.5px"
            borderColor={hasError ? "red.400" : "#E5E5E5"}
            bgColor={disabled ? "gray.100" : "#F8F9FA"}
            _focus={{
              borderColor: hasError ? "red.500" : "primaryColor",
              bgColor: "white",
              outline: "none",
            }}
            borderRadius="full"
            px="4"
            pr={isPassword ? "48px" : "16px"}
            transition="all 0.2s ease"
          />
        </InputGroup>
      </div>
      {hasError && (
        <CustomText
          type="REGULAR"
          fontSize="12px"
          text={errors[name as string] as string}
          color="red"
        />
      )}
    </Flex>
  );
}

export default CustomInput;
