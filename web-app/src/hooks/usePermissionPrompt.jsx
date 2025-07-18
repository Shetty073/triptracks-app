import { useState } from "react";
import PermissionPrompt from "../components/permissionprompt.component.jsx";

export default function usePermissionPrompt() {
  const [promptConfig, setPromptConfig] = useState(null);

  const requestPermission = async (permissionType, message) => {
    if (permissionType === "geolocation" && navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });

        if (result.state === "granted") {
          return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ granted: true, coords: pos.coords }),
              () => resolve({ granted: false })
            );
          });
        } else if (result.state === "denied") {
          return { granted: false };
        }
        // Else continue to show modal
      } catch (e) {
        console.warn("Permission query failed", e);
        // fallback to showing prompt
      }
    }

    return new Promise((resolve) => {
      setPromptConfig({
        message,
        onAccept: async () => {
          setPromptConfig(null);
          if (permissionType === "geolocation") {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ granted: true, coords: pos.coords }),
              () => resolve({ granted: false })
            );
          } else {
            resolve({ granted: false }); // fallback for unsupported permissions
          }
        },
        onDecline: () => {
          setPromptConfig(null);
          resolve({ granted: false });
        }
      });
    });
  };

  const PromptComponent = promptConfig ? (
    <PermissionPrompt
      message={promptConfig.message}
      onAccept={promptConfig.onAccept}
      onDecline={promptConfig.onDecline}
    />
  ) : null;

  return { requestPermission, PromptComponent };
}
