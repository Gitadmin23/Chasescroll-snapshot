import formatter from "format-number"


export const formatNumber = (number: any, prefix = "₦") => {
  if(number === "***") {
    return prefix+" ****"
  } else {
    return(
      formatter({ prefix })(number % 1 !== 0 ? number?.toFixed(2) : number)
    )
  }
}
  