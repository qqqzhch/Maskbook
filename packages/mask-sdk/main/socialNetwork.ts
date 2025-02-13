import type { InitInformation } from '../shared/index.js'
import { contentScript } from './bridge.js'

let connected = false
let metadata: Mask.SocialNetwork['metadata'] = undefined
export class SocialNetwork extends EventTarget implements Mask.SocialNetwork {
    constructor(init: InitInformation) {
        super()
        connected = init.context.connected
        metadata = init.context.meta
    }
    async appendComposition(message: string, metadata?: ReadonlyMap<string, unknown>) {
        if (metadata) metadata = new Map(metadata)
        contentScript.site_appendComposition(message, metadata)
    }
    get connected() {
        return !!connected
    }
    get metadata() {
        return metadata
    }
}
