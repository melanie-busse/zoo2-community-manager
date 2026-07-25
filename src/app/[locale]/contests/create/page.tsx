import ContestCreateClient from "./ContestCreateClient";
import { getAllStatues, getContestSpecialCoats } from "@/service/ContestService";

export default async function CreateContestPage() {
  const [allStatues, allSpecialCoats] = await Promise.all([
    getAllStatues(),
    getContestSpecialCoats(),
  ]);

  return (
    <ContestCreateClient
      statues={JSON.parse(JSON.stringify(allStatues))}
      contestSpecialCoats={JSON.parse(JSON.stringify(allSpecialCoats))}
    />
  );
}
