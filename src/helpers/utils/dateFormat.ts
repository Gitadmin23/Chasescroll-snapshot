import moment from "moment"

export function dateFormat(date: any) {
  return moment(date).format("ddd, MMMM Do YYYY")
} 

export function dateTimeFormat(date: any) {
  return moment(date).format("Do MMM YYYY h:mm A")
} 

export function dateFormatDashboad(date: any) {
  return moment(date).format("ddd, MM/DD/YY")
}

export function dateFormatMonthDay(date: any) {
  return moment(date).format("MMMM Do")
}

export function dateFormatMonth(date: any) {
  return moment(date).format("MMM")
}

export function dateFormatDay(date: any) {
  return moment(date).format("Do")
}

export const timeFormat = (isoString: any) =>
  moment(isoString).format("h.mm A")