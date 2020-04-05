import {Pupil} from './model/Pupil';
import {Teacher} from './model/Teacher';
import {User} from './model/User';
import {Subject} from './model/Subject';

export function customFilter(displayedColumns: string[]) {
  return (data: Pupil | Teacher | Subject, filter: string): boolean => {
    let rowData = '';
    displayedColumns.forEach(column => {
      if (column !== 'actions') {
        rowData = `${rowData + data[column]} `;
      }
    });
    rowData = rowData.trim().toLowerCase();
    let result = true;
    filter.split('+').forEach(key => {
      if (!rowData.includes(key)) {
        result = false;
        return;
      }
    });
    return result;
  };
}

export function customFilterForUsers(displayedColumns: string[]) {
  return (data: User, filter: string): boolean => {
    let userStr = '';
    displayedColumns.forEach(column => {
      if (column === 'firstName'
        || column === 'secondName'
        || column === 'email'
        || column === 'dateBirth'
        || column === 'status') {
        userStr = `${userStr + data[column]} `;
      }
    });
    let roleStr = '';
    data.roles.forEach(role => roleStr = `${roleStr + role.name.substr(5)} `);
    const rowData = (userStr + roleStr).trim().toLowerCase();
    let result = true;
    filter.split('+').forEach(key => {
      if (!rowData.includes(key)) {
        result = false;
        return;
      }
    });
    return result;
  };
}
