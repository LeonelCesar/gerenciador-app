import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await axios.get("/api/team.json");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
