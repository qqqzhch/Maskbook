import { type ECKeyIdentifier, fromHex, type NextIDPlatform, SignType, toBase64 } from '@masknet/shared-base'
import { NextIDStorageAPI } from '../../NextID/kv.js'
import type { StorageAPI } from '../../entry-types.js'

export class NextIDStorage implements StorageAPI.Storage {
    private Storage = new NextIDStorageAPI()

    private publicKeyAsHex = ''
    private signer: ECKeyIdentifier | null = null

    constructor(
        private proofIdentity: string, // proof identity as key
        private platform: NextIDPlatform, // proof platform
        private signerOrPublicKey: string | ECKeyIdentifier, // publicKey, like SocialIdentity publicKey or PersonaIdentifier publicKeyAsHex
        private signWithPersona?: <T>(
            method: SignType,
            message: T,
            identifier?: ECKeyIdentifier,
            silent?: boolean,
        ) => Promise<string>,
    ) {
        if (typeof this.signerOrPublicKey === 'string') {
            this.publicKeyAsHex = this.signerOrPublicKey
        } else {
            this.publicKeyAsHex = this.signerOrPublicKey.publicKeyAsHex
            this.signer = this.signerOrPublicKey
        }
    }

    async has(key: string) {
        return !!this.get(key)
    }

    async get<T>(key: string) {
        const response = await this.Storage.getByIdentity<T>(
            this.publicKeyAsHex,
            this.platform,
            this.proofIdentity,
            key,
        )

        if (!response.ok) return

        return response.val
    }

    async getAll<T>(key: string) {
        const response = await this.Storage.getAllByIdentity<T>(this.platform, this.proofIdentity, key)

        if (!response.ok) return

        return response.val
    }

    async set<T>(key: string, value: T) {
        if (!this.signer) throw new Error('signer is requirement when set data to NextID Storage')

        const payload = await this.Storage.getPayload(
            this.publicKeyAsHex,
            this.platform,
            this.proofIdentity, // identity
            value,
            key,
        )

        if (!payload?.ok) throw new Error('Invalid payload Error')

        const signature = await this.signWithPersona?.(SignType.Message, payload.val.signPayload, this.signer, true)
        if (!signature) throw new Error('Failed to sign payload.')

        await this.Storage.set(
            payload.val.uuid,
            this.publicKeyAsHex,
            toBase64(fromHex(signature)),
            this.platform,
            this.proofIdentity,
            payload.val.createdAt,
            value,
            key,
        )

        return
    }
}
