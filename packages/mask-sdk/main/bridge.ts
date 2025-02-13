import {
    createMaskSDKChannel,
    type BridgeAPI,
    type UserScriptAPI,
    serializer,
    type InitInformation,
} from '../shared/index.js'
import { AsyncCall } from 'async-call-rpc/base.min'

const self: UserScriptAPI = {
    request_init: null!,
}
export const readyPromise = new Promise<InitInformation>((resolve) => {
    self.request_init = async (init) => resolve(init)
})
export const contentScript: BridgeAPI = AsyncCall<BridgeAPI>(self, {
    channel: createMaskSDKChannel('user'),
    serializer,
})
