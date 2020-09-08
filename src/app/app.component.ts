import { Component } from '@angular/core';
import { TEST_DATA } from './test_data';
import _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ctpExcelConvereter';

  rawValue: string = '';
  dispersion: string = '0.1';
  grids: any;
  gridsGenerated: boolean;
  gridsOptions: any[];
  gridsGenerationStart: boolean;

  constructor() {
    console.log(TEST_DATA);
    this.gridsOptions = [];
  }

  applyRawValue(event) {
    this.rawValue = event.target.value;
  }

  generateGrids() {
    this.gridsGenerationStart = true;

    const rows = this.rawValue.split('\n');
    const columnHeaders = rows[0].split(/\t/g);

    const gridsData = _.map(columnHeaders, (header, i) => {
      const depths = _.times(rows.length - 1, (rowNum) => {
        return (rowNum + 1) * Number(this.dispersion);
      });
      const values = _.map(_.tail(rows),  (row) => {
        const rowCellValues = row.split(/\t/);
        return rowCellValues[i];
      });

      const columnDefs = [{ field: 'glebokosc', width: 70, }, { field: header, width: 70, }];

      const rowDataWithNulls = _.map(depths, (depth, i) => {
        const rowDataEl = {
          glebokosc: Number(depth).toFixed(1),
        };
        rowDataEl[header] = _.isNil(values[i]) || _.isEmpty(values[i])? null : Number(values[i]);
        return rowDataEl;
      });

      const rowData = _.reject(rowDataWithNulls, (d) => _.isNil(d[header]));
      return { rowData, columnDefs };
    });

    _.forEach(gridsData, (gridData) => {
      this.gridsOptions[gridData.columnDefs[1].field] = {};
    });

    setTimeout(() => {
      this.grids = gridsData;
      console.log(this.grids);

      setTimeout(() => {
        this.gridsGenerated = true;
        this.gridsGenerationStart = false;
        console.warn(this.gridsOptions);
      });

    }, 100);
  }

  downloadAllCVS() {
    _.forEach(this.grids, (grid) => {
      const options = this.gridsOptions[grid.columnDefs[1].field];
      options.api.exportDataAsCsv({ fileName: options.columnDefs[1].field + '.csv' });
    });
  }
}
