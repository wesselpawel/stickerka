import { toast } from "react-toastify";

export function toastUpdate(
  msg: string,
  id: string | number,
  type: "info" | "success" | "warning" | "error" | "default"
) {
  toast.update(id, {
    render: <span>{msg}</span>,
    type: type,
    isLoading: false,
    closeOnClick: true,
    autoClose: 5000,
  });
}
