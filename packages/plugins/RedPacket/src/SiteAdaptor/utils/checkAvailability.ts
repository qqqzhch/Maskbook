import { Interface } from '@ethersproject/abi'
import REDPACKET_ABI from '@masknet/web3-contracts/abis/HappyRedPacketV4.json'
import type { ChainId } from '@masknet/web3-shared-evm'
import type { RedpacketAvailability } from '@masknet/web3-providers/types'
import { Web3 } from '@masknet/web3-providers'

const interFace = new Interface(REDPACKET_ABI)

// red-packet contract readonly method, read it no matter on whatever chains you are.
export async function checkAvailability(pid: string, from: string, to: string, chainId: ChainId) {
    const callData = interFace.encodeFunctionData('check_availability', [pid])
    const data = await Web3.callTransaction(
        {
            to,
            from,
            data: callData,
        },
        { chainId },
    )
    return decodeResult(data)
}

function decodeResult(data: string): RedpacketAvailability {
    const results = interFace.decodeFunctionResult('check_availability', data)

    return {
        token_address: results[0],
        balance: parseHexToInt(results[1]),
        total: +parseHexToInt(results[2]),
        claimed: +parseHexToInt(results[3]),
        expired: !!results[4],
        claimed_amount: parseHexToInt(results[5]),
    }
}

function parse(input: any) {
    return JSON.parse(JSON.stringify(input))
}

function parseHexToInt(input: any) {
    return Number.parseInt(parse(input).hex, 16).toString()
}
