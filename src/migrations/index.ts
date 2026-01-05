import * as migration_20260105_020655 from './20260105_020655';

export const migrations = [
  {
    up: migration_20260105_020655.up,
    down: migration_20260105_020655.down,
    name: '20260105_020655'
  },
];
