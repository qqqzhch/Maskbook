import type { EncryptPayloadNetwork } from '@masknet/encryption'
import type { EnhanceableSite, PostIdentifier } from '@masknet/shared-base'
import type { IdentityResolved, PostContext, PostContextCreation } from '@masknet/plugin-infra/content-script'
import type { SiteAdaptorUI } from './SiteAdaptorUI.js'

export declare namespace SiteAdaptor {
    export interface Utils {
        /** @returns post URL from PostIdentifier */
        getPostURL?(post: PostIdentifier): URL | null
        getUserIdentity?(useId: string): Promise<IdentityResolved | undefined>
        /** Is this username valid in this network */
        isValidUsername?(username: string): boolean
        /** Handle share */
        share?(text: string): void
        createPostContext: (creation: PostContextCreation) => PostContext
    }
    export interface Shared {
        utils: Utils
    }
    export interface Base {
        /**
         * This name is used internally and should be unique.
         *
         * !!! THIS SHOULD NOT BE USED TO CONSTRUCT A NEW ProfileIdentifier !!!
         */
        networkIdentifier: EnhanceableSite
        encryptPayloadNetwork: EncryptPayloadNetwork
        /**
         * This field _will_ be overwritten by SiteAdaptor.permissions
         */
        declarativePermissions: SiteAdaptorUI.DeclarativePermission
        /** Should this UI content script activate? */
        shouldActivate(location: Location | URL): boolean
        /** This provider is not ready for production, Mask will not use it in production */
        notReadyForProduction?: boolean
    }
}
