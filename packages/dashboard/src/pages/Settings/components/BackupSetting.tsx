import SettingButton from './SettingButton.js'
import { useContext, useEffect, useState } from 'react'
import BackupDialog from './dialogs/BackupDialog.js'
import BackupModeSelectDialog from './dialogs/BackupModeSelectDialog.js'
import { CloudBackupMergeDialog } from './dialogs/CloudBackupMergeDialog.js'
import { useDashboardI18N } from '../../../locales/index.js'
import { CloudBackupVerifyDialog, type VerifyNextData } from './dialogs/CloudBackupVerifyDialog.js'
import { UserContext } from '../hooks/UserContext.js'
import type { VerifyCodeRequest } from '../api.js'
import type { BackupFileInfo } from '../type.js'
import { useLocation, useSearchParams } from 'react-router-dom'

export default function BackupSetting() {
    const t = useDashboardI18N()
    const { state } = useLocation() as {
        state: {
            open: 'setting' | null
        }
    }
    const [pageParams] = useSearchParams()
    const { ensurePasswordSet } = useContext(UserContext)
    const [merged, setMerged] = useState(false)
    const [showDialog, setShowDialog] = useState({
        backup: false,
        mode: !!pageParams.get('mode'),
        verify: false,
        merge: false,
    })

    const [localMode, setLocalMode] = useState(true)
    const [params, setParams] = useState<VerifyCodeRequest | undefined>(undefined)
    const [cloudFileInfo, setCloudFileInfo] = useState<BackupFileInfo | undefined>(undefined)

    useEffect(() => {
        if (!state?.open || state?.open !== 'setting') return
        ensurePasswordSet(() => setShowDialog({ ...showDialog, mode: true }))
    }, [state?.open])

    const onBackup = () => {
        ensurePasswordSet(() => setShowDialog({ ...showDialog, mode: true }))
    }

    const onSelectMode = (mode: 'local' | 'cloud') => {
        if (mode === 'cloud') {
            setLocalMode(false)
            setShowDialog({ ...showDialog, mode: false, verify: true })
        } else {
            setLocalMode(true)
            setShowDialog({ ...showDialog, mode: false, backup: true })
        }
    }

    const handleVerified = ({ fileInfo, params }: VerifyNextData) => {
        setParams(params)

        if (fileInfo) {
            setCloudFileInfo(fileInfo)
            setShowDialog({ ...showDialog, verify: false, merge: true })
        } else {
            setShowDialog({ ...showDialog, verify: false, backup: true })
        }
    }

    return (
        <>
            <SettingButton size="large" onClick={onBackup}>
                {t.settings_button_backup()}
            </SettingButton>
            {showDialog.backup ? (
                <BackupDialog
                    local={localMode}
                    params={params}
                    open={showDialog.backup}
                    merged={merged}
                    onClose={() => setShowDialog({ ...showDialog, backup: false })}
                />
            ) : null}

            <BackupModeSelectDialog
                open={showDialog.mode}
                onClose={() => setShowDialog({ ...showDialog, mode: false })}
                onSelect={onSelectMode}
            />
            {showDialog.verify ? (
                <CloudBackupVerifyDialog
                    open={showDialog.verify}
                    onClose={() => setShowDialog({ ...showDialog, verify: false })}
                    onNext={handleVerified}
                />
            ) : null}

            {cloudFileInfo && params ? (
                <CloudBackupMergeDialog
                    account={params.account}
                    info={cloudFileInfo}
                    open={showDialog.merge}
                    onClose={() => setShowDialog({ ...showDialog, merge: false })}
                    onMerged={(merged) => {
                        setMerged(merged)
                        setShowDialog({ ...showDialog, merge: false, backup: true })
                    }}
                />
            ) : null}
        </>
    )
}
