import { IconButton, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning" | "custom";

interface CustomToastOptions extends ToastOptions {
  actionFunction?: () => void;
  actionIcon?: React.ReactNode;
  count?: number;
  customContent?: React.ReactNode;
  tooltipTitle?: string;
}

const showToast = (
  message: string,
  type: ToastType = "success",
  options?: CustomToastOptions,
): void => {
  const { actionFunction, count, customContent, actionIcon, ...toastOptions } =
    options || {};

  if (type === "custom" || customContent) {
    toast(
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {customContent || (
          <>
            <div className="toast-message">{message}</div>
            {actionFunction && (
              <Tooltip
                disableInteractive
                arrow
                placement="bottom"
                title={toastOptions.tooltipTitle}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    actionFunction();
                    toast.dismiss(toastOptions.toastId);
                  }}
                >
                  {actionIcon}
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </div>,
      {
        ...toastOptions,
        autoClose: toastOptions?.autoClose,
        closeButton: true,
        type: "success",
      },
    );
    return;
  }

  // Default toast types
  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "info":
      toast.info(message, toastOptions);
      break;
    case "warning":
      toast.warning(message, toastOptions);
      break;
    default:
      toast(message, toastOptions);
  }
};

export default showToast;
