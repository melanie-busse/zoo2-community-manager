import ContestOverviewClient from "./ContestOverviewClient";
import { getAllContests } from "@/service/ContestService";
import { Contest } from "@/types/contest";

export default async function ContestsPage() {
  const contests = await getAllContests();

  const serializedContests: Contest[] = JSON.parse(JSON.stringify(contests));

  return <ContestOverviewClient initialContests={serializedContests} />;
}
