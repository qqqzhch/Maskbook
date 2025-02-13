import { useCallback, useEffect, useState } from 'react'
import { MaskColorVar, MaskDialog, useCustomSnackbar, makeStyles } from '@masknet/theme'
import { Box, FormControlLabel, formControlLabelClasses, Radio, RadioGroup, styled, Typography } from '@mui/material'
import { BackupInfoCard } from '../../../../components/Restore/BackupInfoCard.js'
import type { BackupFileInfo } from '../../type.js'
import { useDashboardI18N } from '../../../../locales/index.js'
import { Services } from '../../../../API.js'
import { fetchBackupValue } from '../../api.js'
import { useAsyncFn } from 'react-use'
import { decryptBackup } from '@masknet/backup-format'
import { decode, encode } from '@msgpack/msgpack'
import PasswordField from '../../../../components/PasswordField/index.js'
import { LoadingButton } from '../../../../components/LoadingButton/index.js'

const StyledFormControlLabel = styled(FormControlLabel)({
    [`&.${formControlLabelClasses.root}`]: {
        background: MaskColorVar.lightBackground,
        margin: 0,
        padding: '2px 0',
        borderRadius: 8,
    },
    [`& .${formControlLabelClasses.label}`]: {
        fontSize: 14,
    },
})

const useStyles = makeStyles()(() => ({
    helpContent: {
        fontSize: '13px',
        padding: '12px 0',
        color: MaskColorVar.textSecondary,
    },
}))

export interface CloudBackupMergeDialogProps {
    account: string
    info: BackupFileInfo
    open: boolean
    onClose(): void
    onMerged(merged: boolean): void
}

export function CloudBackupMergeDialog({ account, info, open, onClose, onMerged }: CloudBackupMergeDialogProps) {
    const [mode, setMode] = useState('1')
    const [backupPassword, setBackupPassword] = useState('')
    const [incorrectBackupPassword, setIncorrectBackupPassword] = useState(false)
    const t = useDashboardI18N()
    const { showSnackbar } = useCustomSnackbar()
    const { classes } = useStyles()
    const restoreCallback = useCallback(() => {
        onMerged(true)
        showSnackbar(t.settings_alert_merge_success(), { variant: 'success' })
    }, [onMerged, showSnackbar])

    const [{ loading }, handleMerge] = useAsyncFn(async () => {
        try {
            const encrypted = await fetchBackupValue(info.downloadURL)
            const decrypted = await decryptBackup(encode(account + backupPassword), encrypted)
            const backupText = JSON.stringify(decode(decrypted))

            await Services.Backup.restoreBackup(backupText)

            restoreCallback()
            setBackupPassword('')
        } catch (error) {
            setIncorrectBackupPassword(true)
        }
    }, [backupPassword, account, info])

    const onBackup = async () => {
        if (mode === '1') {
            onMerged(false)
        } else {
            handleMerge()
        }
    }

    useEffect(() => {
        setIncorrectBackupPassword(false)
    }, [backupPassword])

    return (
        <MaskDialog maxWidth="xs" title={t.settings_cloud_backup()} open={open} onClose={onClose}>
            <Box sx={{ padding: '0 24px 24px' }}>
                <BackupInfoCard info={info} />

                <RadioGroup aria-label="mode" name="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                    <StyledFormControlLabel
                        value="1"
                        control={<Radio size="small" />}
                        label={t.settings_dialogs_backup_to_cloud()}
                        style={{ marginTop: '24px' }}
                    />
                    <Typography className={classes.helpContent}>
                        {t.settings_dialogs_backup_to_cloud_action()}
                    </Typography>
                    <StyledFormControlLabel
                        sx={{ fontSize: 14 }}
                        value="2"
                        control={<Radio size="small" />}
                        label={t.settings_dialogs_merge_to_local_data()}
                    />
                </RadioGroup>

                {mode === '2' ? (
                    <PasswordField
                        sx={{ marginTop: '12px' }}
                        fullWidth
                        value={backupPassword}
                        onChange={(event) => setBackupPassword(event.target.value)}
                        placeholder={t.settings_label_backup_password_cloud()}
                        error={incorrectBackupPassword}
                        helperText={incorrectBackupPassword ? t.settings_dialogs_incorrect_password() : ''}
                    />
                ) : null}
                <Typography className={classes.helpContent}>{t.settings_dialogs_backup_merge_cloud()}</Typography>
                <LoadingButton fullWidth onClick={onBackup} loading={loading} disabled={incorrectBackupPassword}>
                    {t.settings_button_backup()}
                </LoadingButton>
            </Box>
        </MaskDialog>
    )
}
