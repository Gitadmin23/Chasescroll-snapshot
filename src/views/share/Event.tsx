"use client";

import React from "react";
import httpService from "@/services/httpService";
import { URLS } from "@/services/urls";
import { Flex } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "@/models/PaginatedResponse";
import { IEventType, IProductTypeData } from "@/models/Event";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";
import { atom, useAtom, useSetAtom } from "jotai";
import {
    activeEventAtom,
    activeTicketAtom,
    affiliateIDAtom,
    ticketurchaseStepAtom,
} from "@/states/activeTicket";
import TicketPurchaseModal from "@/components/Custom/modals/TicketPurchaseModal/Index";
import { toaster } from "@/components/ui/toaster";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import BreadCrumbs from "@/components/Custom/breadcrumbs";
import useCustomTheme from "@/hooks/useTheme";

import {
    EventMediaSection,
    EventInfoSection,
    EventBottomSection,
    EventStatusView,
} from "./components";

export const currentIdAtom = atom<string | null>(null);
export const showTicketModalAtom = atom(false);

interface EventProps {
    id: string;
    affiliateID?: string;
}

function Event({ id, affiliateID }: EventProps) {
    const setCurrentId = useSetAtom(currentIdAtom);
    const setAffiliateID = useSetAtom(affiliateIDAtom);
    const setActiveTicket = useSetAtom(activeTicketAtom);
    const setActiveEvent = useSetAtom(activeEventAtom);
    const setCurrentStep = useSetAtom(ticketurchaseStepAtom);

    const [event, setEvent] = React.useState<IEventType>({} as IEventType);
    const [ticketType, setTicketType] = React.useState<string | null>(null);
    const [tickets, setTickets] = React.useState<IProductTypeData[]>([]);
    const [showModal, setShowModal] = useAtom(showTicketModalAtom);

    const { mainBackgroundColor } = useCustomTheme();

    // Sync atom states
    React.useEffect(() => {
        if (id) {
            setCurrentId(id);
        }
    }, [id, setCurrentId]);

    React.useEffect(() => {
        if (affiliateID) {
            setAffiliateID(affiliateID);
        }
    }, [affiliateID, setAffiliateID]);

    // Fetch Event Data
    const { isLoading, data, isError, refetch } = useQuery<
        AxiosResponse<PaginatedResponse<IEventType>>
    >({
        queryKey: ["get-external-events", id],
        queryFn: () =>
            httpService.get(`${URLS.event}/events`, {
                params: {
                    id,
                },
            }),
        enabled: Boolean(id),
    });

    // Populate event & ticket state
    React.useEffect(() => {
        if (!isLoading && !isError && data?.data) {
            const item: PaginatedResponse<IEventType> = data?.data;
            const currentEvent = item?.content?.[0];
            if (currentEvent) {
                const formattedEvent: IEventType = {
                    ...currentEvent,
                    productTypeData: currentEvent.productTypeData || [],
                };
                setEvent(formattedEvent);
                const eventTickets = formattedEvent.productTypeData;
                setTickets(eventTickets);
                if (eventTickets.length > 0) {
                    setTicketType(eventTickets[0]?.ticketType || null);
                    setActiveTicket(eventTickets[0]);
                }
                setActiveEvent(formattedEvent);
            }
        }
    }, [data, isError, isLoading, setActiveTicket, setActiveEvent]);

    // Restore purchase step from localStorage if flow was in progress
    React.useEffect(() => {
        const step = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
        if (step) {
            const stepNum = Number(step);
            setCurrentStep(stepNum > 0 ? stepNum : 1);
            if (stepNum > 1 && event?.id && (event.productTypeData?.length ?? 0) > 0) {
                setShowModal(true);
            }
        }
    }, [event?.id, event?.productTypeData, setCurrentStep, setShowModal]);

    // Update document title
    React.useEffect(() => {
        if (event?.eventName) {
            document.title = `Chasescroll | ${capitalizeFLetter(event.eventName)}`;
        } else {
            document.title = "Chasescroll | Event";
        }
    }, [event?.eventName]);

    // Ticket selection & purchase modal trigger
    const handlePayment = React.useCallback(() => {
        if (!event?.id) return;

        if (!tickets || tickets.length === 0) {
            toaster.create({
                title: "Notice",
                description: "No tickets are currently available for this event.",
                type: "info",
            });
            return;
        }

        const activeTicket =
            tickets.find((item) => item.ticketType === ticketType) || tickets[0];

        if (activeTicket) {
            setActiveTicket(activeTicket);
            setActiveEvent(event);
            setShowModal(true);
        } else {
            toaster.create({
                title: "Error",
                description: "No ticket found for this ticket type",
                type: "error",
            });
        }
    }, [ticketType, tickets, event, setActiveTicket, setActiveEvent, setShowModal]);

    // Computed properties
    const isAdmin = Boolean(
        event?.isOrganizer ||
        event?.eventMemberRole === "ADMIN" ||
        event?.eventMemberRole === "COLLABORATOR"
    );

    const showPrBtn = Boolean(
        !event?.isOrganizer &&
        event?.eventMemberRole !== "ADMIN" &&
        event?.eventMemberRole !== "COLLABORATOR"
    );

    const eventImages = React.useMemo(() => {
        if (event?.picUrls && event.picUrls.length > 0) {
            return event.picUrls;
        }
        if (event?.currentPicUrl) {
            return [event.currentPicUrl];
        }
        return [];
    }, [event?.picUrls, event?.currentPicUrl]);

    const mapCoordinates = React.useMemo(() => {
        if (!event?.location?.latlng) return null;
        const parts = event.location.latlng.trim().split(/[\s,]+/);
        if (parts.length < 2) return null;
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (isNaN(lat) || isNaN(lng)) return null;
        return { lat, lng };
    }, [event?.location?.latlng]);

    // Loading & Error States
    if (isLoading) {
        return <EventStatusView type="loading" />;
    }

    if (isError || (!isLoading && !event?.id)) {
        return <EventStatusView type="error" onRetry={() => refetch()} />;
    }

    const hasTickets = tickets.length > 0;
    const ticketAvailabilityText = hasTickets
        ? `See ticket${tickets.length > 1 ? "s" : ""} available for this event`
        : "No tickets currently available";

    return (
        <Flex
            w="full"
            bgColor={mainBackgroundColor}
            flexDir="column"
            gap="4"
            px={["4", "4", "6"]}
            pb={["12", "12", "6"]}
            py="6"
        >
            <TicketPurchaseModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                type="EVENT"
                event={event}
            />

            <BreadCrumbs {...event} />

            {/* Top Section: Media Scroller + Event Details */}
            <Flex w="full" gap="4" flexDir={["column", "column", "row"]}>
                <EventMediaSection event={event} images={eventImages} />
                <EventInfoSection
                    event={event}
                    isAdmin={isAdmin}
                    showPrBtn={showPrBtn}
                    hasTickets={hasTickets}
                    ticketAvailabilityText={ticketAvailabilityText}
                    onSelectTicket={handlePayment}
                />
            </Flex>

            {/* Bottom Section: Mesh, Donation & Map Location */}
            <EventBottomSection event={event} mapCoordinates={mapCoordinates} />
        </Flex>
    );
}

export default Event;
