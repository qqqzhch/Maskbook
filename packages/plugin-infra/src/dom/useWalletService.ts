import { type LegacyWalletRecord, type Wallet, ValueRefWithReady, type ECKeyIdentifier } from '@masknet/shared-base'
import { useValueRef } from '@masknet/shared-base-ui'

export interface MaskAccount {
    address: string
    owner?: string
    identifier?: ECKeyIdentifier
}

export interface WalletBackupProvider {
    getLegacyWallets(): Promise<LegacyWalletRecord[]>
    getWallets(): Promise<Wallet[]>
    getDerivableAccounts(
        mnemonic: string,
        page: number,
        pageSize?: number,
    ): Promise<
        Array<{
            index: number
            address: string
            derivationPath: string
        }>
    >
    changePassword(oldPassword: string, newPassword: string): Promise<void>
    setPassword(newPassword: string): Promise<void>
    verifyPassword(unverifiedPassword: string): Promise<boolean>
    hasPassword(): Promise<boolean>
    resetPassword(newPassword: string): Promise<void>
    setDefaultPassword(): Promise<void>

    createMnemonicWords(): Promise<string[]>
    exportMnemonicWords(address: string): Promise<string>
    exportPrivateKey(address: string): Promise<string>
    createWalletFromMnemonicWords(name: string, mnemonic: string, derivationPath?: string): Promise<string>
    recoverWalletFromPrivateKey(name: string, privateKey: string): Promise<string>
    recoverWalletFromKeyStoreJSON(name: string, json: string, jsonPassword: string): Promise<string>
    recoverWalletFromMnemonicWords(name: string, mnemonic: string, derivationPath?: string): Promise<string>
    resolveMaskAccount(accounts: MaskAccount[]): Promise<void>
    generateAddressFromMnemonicWords(
        name: string,
        mnemonic: string,
        derivationPath?: string,
    ): Promise<string | undefined>
}

export const WalletServiceRef = new ValueRefWithReady<WalletBackupProvider>()

export function useWalletService() {
    return useValueRef(WalletServiceRef)
}
