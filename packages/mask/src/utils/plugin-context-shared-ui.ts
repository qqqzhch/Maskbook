import type { Plugin } from '@masknet/plugin-infra'
import {
    createSubscriptionFromAsync,
    CrossIsolationMessages,
    EMPTY_LIST,
    MaskMessages,
    Sniffings,
} from '@masknet/shared-base'
import { WalletConnectQRCodeModal } from '@masknet/shared'
import Services from '../extension/service.js'
import type { PartialSharedUIContext } from '../../shared/plugin-infra/host.js'
import { WalletRPC } from '../plugins/WalletService/messages.js'

export const RestPartOfPluginUIContextShared: Omit<
    Plugin.SiteAdaptor.SiteAdaptorContext,
    | keyof PartialSharedUIContext
    | 'lastRecognizedProfile'
    | 'currentVisitingProfile'
    | 'themeSettings'
    | 'getThemeSettings'
    | 'getNextIDPlatform'
    | 'getSocialIdentity'
    | 'getPersonaAvatar'
    | 'setMinimalMode'
    | 'queryPersonaByProfile'
    | 'connectPersona'
    | 'createPersona'
    | 'currentPersonaIdentifier'
    | 'allPersonas'
    | 'getSearchedKeyword'
> = {
    currentPersona: createSubscriptionFromAsync(
        Services.Settings.getCurrentPersonaIdentifier,
        undefined,
        MaskMessages.events.currentPersonaIdentifier.on,
    ),
    send: WalletRPC.send,

    openDashboard: Services.Helper.openDashboard,
    openPopupWindow: Services.Helper.openPopupWindow,
    closePopupWindow: Services.Helper.removePopupWindow,
    openPopupConnectWindow: Services.Helper.openPopupConnectWindow,
    fetchJSON: Services.Helper.fetchJSON,

    openWalletConnectDialog: async (uri: string) => {
        if (Sniffings.is_popup_page) {
            CrossIsolationMessages.events.popupWalletConnectEvent.sendToAll({ uri, open: true })
            return
        }
        await WalletConnectQRCodeModal.openAndWaitForClose({
            uri,
        })
    },
    closeWalletConnectDialog: () => {
        if (Sniffings.is_popup_page) {
            CrossIsolationMessages.events.popupWalletConnectEvent.sendToAll({ open: false })
            return
        }
        WalletConnectQRCodeModal.close()
    },

    selectAccount: WalletRPC.selectMaskAccount,

    recordConnectedSites: WalletRPC.recordConnectedSites,

    signWithPersona: Services.Identity.signWithPersona,
    signWithWallet: WalletRPC.signWithWallet,

    wallets: createSubscriptionFromAsync(
        () => WalletRPC.getWallets(),
        EMPTY_LIST,
        CrossIsolationMessages.events.walletsUpdated.on,
    ),

    getWallets: WalletRPC.getWallets,
    addWallet: WalletRPC.addWallet,
    updateWallet: WalletRPC.updateWallet,
    removeWallet: WalletRPC.removeWallet,
    resetAllWallets: WalletRPC.resetAllWallets,

    hasPaymentPassword: WalletRPC.hasPassword,
}
