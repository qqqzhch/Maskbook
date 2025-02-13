import { series, type TaskFunction } from 'gulp'
import { fromNPMTask, PKG_PATH, task } from '../utils/index.js'
import { codegen } from '../codegen/index.js'

const [build] = fromNPMTask(new URL('app/', PKG_PATH), 'spa', 'Build Web App of Mask Network.')

export const buildSPA: TaskFunction = series(codegen, build)

task(buildSPA, 'build-app', 'Build App')
