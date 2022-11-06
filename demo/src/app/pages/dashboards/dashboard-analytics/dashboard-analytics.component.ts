import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardAnalyticsService } from './dashboard-analytics.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'vex-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss'],
  providers:[DatePipe]
})
export class DashboardAnalyticsComponent implements OnInit {
displayedColumns: string[] = ['symbols', 'date', 'value'];
tableDataSource = [];
// Preparing the chart data
fusionChartData = [];
// Chart Configuration
 dataSource = {
  chart: {
    caption: "",
    subCaption: "", 
    xAxisName: "Hisse",
    yAxisName: "Değer", 
    numberSuffix: "K",
    theme: "fusion" 
  },
  data: this.fusionChartData
};
  toolbarFilterForm:FormGroup;
  periods = [
    {value: '15min', viewValue: '15 Dakika'},
    {value: '30min', viewValue: '30 Dakika'},
    {value: '60min', viewValue: '60 Dakika'},
    {value: 'Daily', viewValue: '1 Gün'},

  ];
  shareList: string[] = ['IBM', 'AAPL', 'MSFT', 'AMZN', 'GOOG'];

  icMoreVert = icMoreVert;
  chartData = [];
  constructor(
    private cd: ChangeDetectorRef,
    private dashboardAnalyticsService: DashboardAnalyticsService ,
    private fb: FormBuilder ,public datepipe: DatePipe
    ) { }

  ngOnInit() {
    this.toolbarFilterForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      symbols: ['', Validators.required],
      periodControl: ['', Validators.required]
    });

    setTimeout(() => {
      const temp = [
        {
          name: 'Subscribers',
          data: [55, 213, 55, 0, 213, 55, 33, 55]
        },
        {
          name: ''
        }
      ];
    }, 3000);
  }

  showData(){

    if(this.toolbarFilterForm.valid){
      const startDate = this.datepipe.transform(this.toolbarFilterForm.controls['start'].value, 'yyyy-MM-dd');
      const endDate = this.datepipe.transform(this.toolbarFilterForm.controls['end'].value,'yyyy-MM-dd');
      const symbols = this.toolbarFilterForm.controls['symbols'].value;
      const period = this.toolbarFilterForm.controls['periodControl'].value;
      const periodDesc = this.toolbarFilterForm.controls['periodControl'].value === "Daily" ? "TIME_SERIES_DAILY":"TIME_SERIES_INTRADAY";
      this.dashboardAnalyticsService.getConfig(period,symbols,periodDesc).subscribe(
        (data)=>
        {
          this.chartData=[];
          this.tableDataSource = [];
          data = data[`Time Series (${period})`];
           for(var i in data){
            this.chartData.push({
              date : i,
              value : data[i]['4. close']
            });
          }
          var filteredData = this.chartData.filter((x)=>this.datepipe.transform(x.date, 'yyyy-MM-dd')>=startDate && this.datepipe.transform(x.date, 'yyyy-MM-dd')<=endDate );
          this.dataSource.chart.caption = symbols;     
          for (let k = 0; k < filteredData.length; k++) {
            this.fusionChartData.push({
              label:filteredData[k].date,
              value:filteredData[k].value
            });
            this.tableDataSource.push({
              symbols:symbols[0],
              date:filteredData[k].date,
              value:filteredData[k].value
            })
          } 
        }
      );

    }
  }
}
