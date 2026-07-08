import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface ConfirmDeleteOptions {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const confirmDeleteDialog = async ({
  title,
  text,
  confirmButtonText = "Löschen",
  cancelButtonText = "Abbrechen",
}: ConfirmDeleteOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};
