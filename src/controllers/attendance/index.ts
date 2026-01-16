import { createAttendance } from './create'
import { findAllAttendance } from './findAllAttendance'
import { findAllAttendanceHistories } from './findAllAttendanceHistory'
import { findAllLastStatusAttendance } from './findAllLastStatusAttendance'
import { findDetailAttendance } from './findDetailAttendance'
import { findDetailAttendanceHistory } from './findDetailAttendanceHistory'
import { findDetailLastStatusAttendance } from './findDetailLastStatusAttendance'
import { findLastStatus } from './lastStatus'

export const attendanceController = {
  createAttendance,
  findAllAttendance,
  findDetailAttendance,
  findAllLastStatusAttendance,
  findDetailLastStatusAttendance,
  findAllAttendanceHistories,
  findDetailAttendanceHistory,
  findLastStatus
}
