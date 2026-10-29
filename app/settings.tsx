import React from "react";
import { Screen } from "@/components/layout";
import { SettingsFlowScreen } from "@/modules/settings";

export default function SettingsRoute() {
  return (
    <Screen keyboardAvoiding>
      <SettingsFlowScreen />
    </Screen>
  );
}
