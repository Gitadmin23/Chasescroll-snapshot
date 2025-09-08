import React from "react";

interface Props {
  maxPrice: any;
  minPrice?: any;
  currency: any;
  indetail?: boolean;
  font?: any;
}

function EventPrice(props: Props) {
  const { maxPrice, minPrice, currency, indetail, font } = props;

  const DataFormater = (number: number, prefix: string) => {
    if (number >= 1000000000) {
      return prefix + (number / 1000000000)?.toString() + "B";
    } else if (number >= 1000000) {
      return prefix + (number / 1000000)?.toString() + "M";
    } else if (number >= 1000) {
      return prefix + (number / 1000)?.toString() + "K";
    } else {
      return prefix + (number ? number : 0)?.toString();
    }
  };

  return (
    <>
      {!indetail && (
        <>
          {(minPrice === 0 && maxPrice === 0) || (!minPrice && !maxPrice) ? (
            "Free"
          ) : (
            <>
              {minPrice === maxPrice && (
                <>
                  {minPrice
                    ? DataFormater(minPrice, currency === "USD" ? "$" : "₦")
                    : "0"}
                </>
              )}
              {minPrice !== maxPrice && (
                <>
                  {minPrice
                    ? DataFormater(minPrice, currency === "USD" ? "$" : "₦")
                    : minPrice === 0
                    ? "Free"
                    : "0"}
                  {" - "}
                  {maxPrice
                    ? DataFormater(maxPrice, currency === "USD" ? "$" : "₦")
                    : "0"}
                </>
              )}
            </>
          )}
        </>
      )}
      {indetail && (
        <>
          {minPrice === 0 && maxPrice === 0 ? (
            "Free"
          ) : (
            <>
              {minPrice === maxPrice && (
                <>{DataFormater(minPrice, currency === "USD" ? "$" : "₦")}</>
              )}
              {minPrice !== maxPrice && (
                <>
                  {DataFormater(minPrice, currency === "USD" ? "$" : "₦")}-
                  {DataFormater(maxPrice, currency === "USD" ? "$" : "₦")}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default EventPrice;
