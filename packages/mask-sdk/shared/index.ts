export interface BridgeAPI {
    persona_sign_web3(message: string): Promise<string>
    site_appendComposition(message: string, metadata?: ReadonlyMap<string, unknown>): Promise<void>
}
export interface UserScriptAPI {
    // When User script loaded, content script is not loaded. We must _be_ called to make sure CS has loaded.
    request_init(init: InitInformation): Promise<void>
}
export interface InitInformation {
    context: {
        meta: Mask.SocialNetwork['metadata']
        connected: boolean
    }
}
export { serializer } from './serializer.js'
export { createMaskSDKChannel } from './channel.js'
