
import * as Yup from "yup";

export const validationSchemaTheme = Yup.object().shape({
  eventType: Yup.string().required("Event type is required"),
  eventName: Yup.string().required("Event name is required"),
  eventDescription: Yup.string().required("Event description is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string().required("End date is required"),
});


export const validationSchemaFundraising = Yup.object().shape({
  data: Yup.array().of(
    Yup.object().shape({ 
      name: Yup.string().required('Fundraising name is required'), 
      description: Yup.string().required('Fundraising description is required'),
      goal: Yup.string().required('Fundraising goal is required'),
      purpose: Yup.string().required('Fundraising purpose is required'),
      endDate: Yup.string().required('End date is required'), 
    })
  ).required('Data array is required'),
});

export const validationSchemaCommunity = Yup.object().shape({
  name: Yup.string().required("Community name is required"),
  description: Yup.string().required("Community description is required"),
});

export const validationSchemaTicket = Yup.object().shape({
  productTypeData: Yup.array()
    .of(
      Yup.object().shape({
        totalNumberOfTickets: Yup.number()
          .typeError("Total tickets must be a number")
          .required("Total number of tickets is required"),
        ticketPrice: Yup.number()
          .typeError("Ticket price must be a number")
          .required("Ticket price is required")
          .test(
            "price-validation-based-on-type",
            "Ticket price must be 0 for Free, at least 0 for Early Bird, and greater than 0 for others",
            function (value) {
              const { ticketType, isFree } = this.parent;
              const type = ticketType?.toLowerCase();

              if (isFree) {
                return value === 0;
              } else if (type === "early bird") {
                return value >= 0;
              } else {
                return value > 0;
              }
            }
          ),
        ticketType: Yup.string().required("Ticket type is required"),
        minTicketBuy: Yup.number()
          .typeError("Minimum tickets must be a number")
          .min(1, "Minimum ticket buy must be at least 1")
          .required("Minimum ticket buy is required"),
        maxTicketBuy: Yup.number()
          .typeError("Maximum tickets must be a number")
          .nullable(),
        rerouteURL: Yup.string().url().nullable(),
      })
    )
    .min(1, "At least one ticket type must be defined"),

});
