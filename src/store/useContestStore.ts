import { create } from "zustand";
import { Contest } from "@/types/contest";
import { confirmDeleteDialog, showErrorToast, showSuccessToast } from "@/utils/alerts";
import {
  createContestOnClient,
  deleteContestOnClient,
  updateContestOnClient,
} from "@/service/frontend/Contest";

interface ContestState {
  allContests: Contest[];

  setInitialContests: (contests: Contest[]) => void;
  saveContest: (formData: any) => Promise<number | false>;
  deleteContest: (id: number, t: any, tCommon: any) => Promise<boolean>;
}

export const useContestStore = create<ContestState>((set) => ({
  allContests: [],

  setInitialContests: (contests) => set({ allContests: contests }),

  saveContest: async (formData) => {
    const isEdit = !!formData.id;

    try {
      const result = isEdit
        ? await updateContestOnClient(formData.id, formData)
        : await createContestOnClient(formData);

      set((state) => {
        const updated = isEdit
          ? state.allContests.map((c) => (c.id === result.id ? result : c))
          : [...state.allContests, result];
        return { allContests: updated };
      });

      return result.id as number;
    } catch (error: any) {
      showErrorToast(error.message || "Error saving contest");
      return false;
    }
  },

  deleteContest: async (id, t, tCommon) => {
    const confirmed = await confirmDeleteDialog({
      title: t("contestOverview.messages.deleteErrorTitle"),
      text: t("contestOverview.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });

    if (!confirmed) return false;

    try {
      await deleteContestOnClient(id);
      set((state) => ({ allContests: state.allContests.filter((c) => c.id !== id) }));
      showSuccessToast(t("contestOverview.messages.deleteSuccess"));
      return true;
    } catch (error: any) {
      showErrorToast(error.message);
      return false;
    }
  },
}));
