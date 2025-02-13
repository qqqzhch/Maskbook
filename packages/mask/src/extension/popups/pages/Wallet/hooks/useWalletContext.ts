import { useEffect, useState } from 'react'
import { useAsync } from 'react-use'
import { useLocation } from 'react-router-dom'
import { type Wallet } from '@masknet/shared-base'
import { useWallets, useCurrencyType, useFiatCurrencyRate } from '@masknet/web3-hooks-base'
import { isSameAddress } from '@masknet/web3-shared-base'
import { createContainer } from 'unstated-next'
import Services from '../../../../service.js'

function useWalletContext() {
    const location = useLocation()
    const wallets = useWallets()

    const { value: personaManagers } = useAsync(async () => {
        return Services.Identity.queryOwnedPersonaInformation(true)
    }, [])

    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>()
    const currencyType = useCurrencyType()
    const { data: fiatCurrencyRate = 1 } = useFiatCurrencyRate()

    useEffect(() => {
        const contractAccount = new URLSearchParams(location.search).get('contractAccount')
        if (!contractAccount || selectedWallet) return
        const target = wallets.find((x) => isSameAddress(x.address, contractAccount))
        setSelectedWallet(target)
    }, [location.search, wallets, selectedWallet])

    return {
        currencyType,
        fiatCurrencyRate,
        personaManagers,
        /**
         * @deprecated
         * Avoid using this, pass wallet as a router parameter instead
         */
        selectedWallet,
        /**
         * @deprecated
         * pass wallet as a router parameter instead
         */
        setSelectedWallet,
    }
}

export const WalletContext = createContainer(useWalletContext)
