import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ErrorLogService } from '../../services/error-log.service';
import { ErrorLog } from '../../models/error-log.model';

declare function init_plugins();
declare function loader_show(text_loader);

@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.component.html',
  styleUrls: ['./error-logs.component.css']
})
export class ErrorLogsComponent implements OnInit, AfterViewInit {

  pageTitle: string = '';
  breadcrumb: string[] = [];

  form: FormGroup;
  errorLog: ErrorLog[] = [];

  /**
   * Opciones de la tabla [Datatable]
   *
   * @type {DataTables.Settings}
   * @memberof UsersComponent
   */
  dtOptions: DataTables.Settings = {};

  /**
   * Disparador de cambios de la tabla [Datatable]
   *
   * @type {Subject}
   * @memberof UsersComponent
   */
  // @ts-ignore
  dtTrigger: Subject = new Subject();

  constructor(public _errorLogService: ErrorLogService,
              private _activeRoute: ActivatedRoute,
              private _titleService: Title) { }

  ngOnInit() {
    init_plugins();
    this._activeRoute.data.subscribe(f => {
      this.breadcrumb = f.path.split('.');

      this.pageTitle = f.title;
      this._titleService.setTitle(this.pageTitle);

      this.form = new FormGroup({
        beginDate: new FormControl('', [
          Validators.required
        ]),
        endDate: new FormControl('', [
          Validators.required
        ])
      });
    });
  }

  ngAfterViewInit(): void {
    $('#date-range').datepicker({
      language: 'es',
      todayHighlight: true,
      todayBtn: true,
      autoclose: true,
      format: 'yyyy-mm-dd'
    });

    $('#beginDate').change(() => {
      this.form.controls.beginDate.setValue($('#beginDate').val());
    });

    $('#endDate').change(() => {
      this.form.controls.endDate.setValue($('#endDate').val());
    });
  }

  setRangeDate(range) {
    const today = new Date();
    $('#endDate').val(today.toISOString().substring(0, 10));
    this.form.controls.endDate.setValue($('#endDate').val());
    switch (range) {
      case 'week':
        today.setDate(today.getDate() - 7);
        $('#beginDate').val(today.toISOString().substring(0, 10));
        break;
      case 'month':
        today.setMonth(today.getMonth() - 1);
        $('#beginDate').val(today.toISOString().substring(0, 10));
        break;
      case 'year':
        today.setFullYear(today.getFullYear() - 1);
        $('#beginDate').val(today.toISOString().substring(0, 10));
        break;
    }
    this.form.controls.beginDate.setValue($('#beginDate').val());
    this.sendRequest();
  }

  sendRequest() {
    loader_show('Cargando...');
    const str_beginDate: string = this.form.controls.beginDate.value;
    const str_endDate: string = this.form.controls.endDate.value;
    this._errorLogService.getErrorLog(str_beginDate, str_endDate).subscribe((resp) => {
      this.errorLog = resp;
      this.dtTrigger.next();
      init_plugins();
    });
  }

}
