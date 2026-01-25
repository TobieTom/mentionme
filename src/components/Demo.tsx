/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useFrameContext } from "~/components/providers/frame-provider";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount } from "wagmi";
import { Settings, LogIn, ProfileCircle, Coins, Terminal, Send, GraphUp } from "iconoir-react";
import { SignInAction } from "~/components/actions/signin";
import { ViewProfileAction } from "~/components/actions/view-profile";
import { SetPrice } from "~/components/mentionme/SetPrice";
import { PayMention } from "~/components/mentionme/PayMention";
import { EarningsDashboard } from "~/components/mentionme/EarningsDashboard";
import { SignSiweMessage, SwitchChain } from "~/components/wallet/wallet-actions";
import { BasePay } from "~/components/wallet/base-pay";
import { TopBar } from "~/components/top-bar";
import { ActionList } from "~/components/action-list";
import { ActionDetail } from "~/components/action-detail";
import { WalletList } from "~/components/wallet-list";
import { WalletDetail } from "~/components/wallet-detail";
import { WalletConnectPrompt } from "~/components/wallet-connect-prompt";
import { ContextView } from "~/components/context-view";
import { BottomNavigation } from "~/components/bottom-navigation";
import { TabType, ActionPageType, WalletPageType, ActionDefinition, WalletActionDefinition } from "~/types";


const WalletActionsComponent = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-medium mb-3">Interactions</h3>
      <SignSiweMessage />
    </div>
    <SwitchChain />
  </div>
);

export default function Demo() {
  const frameContext = useFrameContext();
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>("actions");
  const [currentActionPage, setCurrentActionPage] = useState<ActionPageType>("list");
  const [currentWalletPage, setCurrentWalletPage] = useState<WalletPageType>("list");
  const [capabilities, setCapabilities] = useState<string[] | null>(null);

  useEffect(() => {
    const getCapabilities = async () => {
      try {
        const caps = await sdk.getCapabilities();
        setCapabilities(caps);
      } catch (error) {
        console.error('Failed to get capabilities:', error);
      }
    };
    getCapabilities();
  }, []);

  const actionDefinitions: ActionDefinition[] = [
    { id: "signin", name: "Sign In", description: "Authenticate with Farcaster", component: SignInAction, icon: LogIn },
    { id: "setprice", name: "Set Mention Price", description: "Choose how much people pay to @mention you", component: SetPrice, icon: Coins },
    { id: "paymention", name: "Pay for Mention", description: "Pay to @mention someone and get guaranteed attention", component: PayMention, icon: Send },
    { id: "earningsdashboard", name: "Earnings Dashboard", description: "See how much you've earned from mentions", component: EarningsDashboard, icon: GraphUp },
    { id: "viewprofile", name: "View Profile", description: "View user profiles", component: ViewProfileAction, icon: ProfileCircle },
    { id: "runtime", name: "Runtime Detection", description: "Get chains and capabilities", component: () => null, icon: Terminal },
  ];

  const walletActionDefinitions: WalletActionDefinition[] = [
    { id: "basepay", name: "Base Pay", description: "Debug Base Pay", component: BasePay, icon: Coins },
    { id: "wallet", name: "Wallet", description: "Debug wallet interactions", component: WalletActionsComponent, icon: Settings },
  ];

  const handleTabChange = async (tab: TabType) => {
    if (capabilities?.includes('haptics.selectionChanged')) {
      await sdk.haptics.selectionChanged();
    }

    setActiveTab(tab);
    if (tab === "actions") {
      setCurrentActionPage("list");
    } else if (tab === "wallet") {
      setCurrentWalletPage("list");
    }
  };

  const handleActionSelect = async (actionId: ActionPageType) => {
    try {
      await sdk.haptics.selectionChanged();
    } catch (error) {
      console.log('Haptics not supported:', error);
    }

    setCurrentActionPage(actionId);
  };

  const handleBackToActionList = async () => {
    try {
      await sdk.haptics.impactOccurred('light');
    } catch (error) {
      console.log('Haptics not supported:', error);
    }

    setCurrentActionPage("list");
  };

  const handleWalletActionSelect = async (walletActionId: WalletPageType) => {
    try {
      await sdk.haptics.selectionChanged();
    } catch (error) {
      console.log('Haptics not supported:', error);
    }

    setCurrentWalletPage(walletActionId);
  };

  const handleBackToWalletList = async () => {
    try {
      await sdk.haptics.impactOccurred('light');
    } catch (error) {
      console.log('Haptics not supported:', error);
    }

    setCurrentWalletPage("list");
  };

  return (
    <div style={{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      marginTop: (frameContext?.context as any)?.client?.safeAreaInsets?.top ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      marginLeft: (frameContext?.context as any)?.client?.safeAreaInsets?.left ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      marginRight: (frameContext?.context as any)?.client?.safeAreaInsets?.right ?? 0,
    }}>
      <div className="w-full max-w-lg mx-auto">
        <div className="px-4 py-4">
          <TopBar />
        </div>

        <div className="px-4 pb-20">
          {activeTab === "actions" && (
            <div>
              {currentActionPage === "list" ? (
                <ActionList
                  actions={actionDefinitions}
                  onActionSelect={handleActionSelect}
                />
              ) : (
                <ActionDetail
                  currentActionPage={currentActionPage}
                  actionDefinitions={actionDefinitions}
                  onBack={handleBackToActionList}
                />
              )}
            </div>
          )}

          {activeTab === "context" && <ContextView />}

          {activeTab === "wallet" && (
            <div className="space-y-4">
              {!isConnected ? (
                <WalletConnectPrompt />
              ) : (
                <div>
                  {currentWalletPage === "list" ? (
                    <WalletList
                      walletActions={walletActionDefinitions}
                      onWalletActionSelect={handleWalletActionSelect}
                    />
                  ) : (
                    <WalletDetail
                      currentWalletPage={currentWalletPage}
                      walletActionDefinitions={walletActionDefinitions}
                      onBack={handleBackToWalletList}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
}