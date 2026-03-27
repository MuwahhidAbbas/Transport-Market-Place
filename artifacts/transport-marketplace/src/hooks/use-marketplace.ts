import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, TransportRequest, Offer } from "../data/mockDb";

export const QUERY_KEYS = {
  currentUser: ["currentUser"],
  requests: ["requests"],
  request: (id: string) => ["request", id],
  offers: (reqId: string) => ["offers", reqId],
  myBids: ["myBids"],
  dashboard: ["dashboard"],
};

export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.currentUser,
    queryFn: api.getCurrentUser,
  });
}

export function useToggleRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.toggleRole,
    onSuccess: () => {
      // Invalidate everything when role changes
      queryClient.invalidateQueries();
    },
  });
}

export function useRequests() {
  return useQuery({
    queryKey: QUERY_KEYS.requests,
    queryFn: api.getRequests,
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.request(id),
    queryFn: () => api.getRequestById(id),
    enabled: !!id,
  });
}

export function useOffers(requestId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.offers(requestId),
    queryFn: () => api.getOffersForRequest(requestId),
    enabled: !!requestId,
  });
}

export function useMyBids() {
  return useQuery({
    queryKey: QUERY_KEYS.myBids,
    queryFn: api.getMyBids,
  });
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: api.getDashboardMetrics,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}

export function useSubmitOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.submitOffer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offers(variables.requestId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myBids });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}

export function useAcceptOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, offerId }: { requestId: string, offerId: string }) => 
      api.acceptOffer(requestId, offerId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.request(variables.requestId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offers(variables.requestId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}
