import { useEffect } from 'react'
import { useAsyncRetry } from 'react-use'
import { EMPTY_LIST, MaskMessages, NextIDPlatform } from '@masknet/shared-base'
import { NextIDProof } from '@masknet/web3-providers'
import { useAllPersonas, useSiteAdaptorContext } from '@masknet/plugin-infra/content-script'

export function useConnectedPersonas() {
    const personasInDB = useAllPersonas()
    const { getPersonaAvatars } = useSiteAdaptorContext()

    const result = useAsyncRetry(async () => {
        const allPersonaPublicKeys = personasInDB.map((x) => x.identifier.publicKeyAsHex)
        const allPersonaIdentifiers = personasInDB.map((x) => x.identifier)

        const avatars = await getPersonaAvatars?.(allPersonaIdentifiers)
        const allNextIDBindings = await NextIDProof.queryExistedBindingByPlatform(
            NextIDPlatform.NextID,
            allPersonaPublicKeys.join(','),
        )

        return personasInDB.map((x) => {
            return {
                persona: x,
                proof:
                    allNextIDBindings
                        .find((p) => p.persona.toLowerCase() === x.identifier.publicKeyAsHex.toLowerCase())
                        ?.proofs.filter((x) => x.is_valid) ?? EMPTY_LIST,
                avatar: avatars?.get(x.identifier),
            }
        })
    }, [personasInDB, getPersonaAvatars])

    useEffect(() => MaskMessages.events.ownProofChanged.on(result.retry), [result.retry])

    return result
}
