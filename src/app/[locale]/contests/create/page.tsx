import ContestCreateClient from "./ContestCreateClient";
import { getAllStatues } from "@/service/ContestService";

export default async function CreateContestPage() {
  const allStatues = await getAllStatues();

  // Plain Objects für den Client vorbereiten (Date-Handling)
  const statues = JSON.parse(JSON.stringify(allStatues));

  return <ContestCreateClient statues={statues} />;
}
